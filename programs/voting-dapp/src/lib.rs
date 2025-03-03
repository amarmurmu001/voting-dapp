use anchor_lang::prelude::*;

declare_id!("3ThCo6aDC3H9qmUNz8dALXLrbJbogvVCZeN3iu6Gbsee");

#[program]
pub mod voting_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize the program state
        let program_state = &mut ctx.accounts.program_state;
        program_state.proposal_count = 0;
        program_state.authority = ctx.accounts.authority.key();

        Ok(())
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        end_time: i64,
    ) -> Result<()> {
        // Get program state
        let program_state = &mut ctx.accounts.program_state;
        let proposal_id = program_state.proposal_count;

        // Create new proposal
        let proposal = &mut ctx.accounts.proposal;
        proposal.id = proposal_id;
        proposal.title = title;
        proposal.description = description;
        proposal.creator = ctx.accounts.creator.key();
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.end_time = end_time;
        proposal.is_active = true;
        proposal.total_voters = 0;

        // Increment proposal count
        program_state.proposal_count += 1;

        emit!(ProposalCreatedEvent {
            proposal_id,
            creator: proposal.creator,
            title: proposal.title.clone(),
            end_time,
        });

        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, vote: bool) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let voter_info = &mut ctx.accounts.voter_info;

        // Check if proposal is still active
        require!(proposal.is_active, VotingError::ProposalNotActive);
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time <= proposal.end_time, VotingError::VotingPeriodEnded);

        // Check if voter has already voted
        require!(!voter_info.has_voted, VotingError::AlreadyVoted);

        // Record the vote
        if vote {
            proposal.yes_votes += 1;
        } else {
            proposal.no_votes += 1;
        }

        // Mark that this voter has voted
        voter_info.has_voted = true;
        voter_info.vote = vote;
        
        // Increment total voters
        proposal.total_voters += 1;

        emit!(VoteCastEvent {
            proposal_id: proposal.id,
            voter: ctx.accounts.voter.key(),
            vote,
        });

        Ok(())
    }

    pub fn finalize_proposal(ctx: Context<FinalizeProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal is still active
        require!(proposal.is_active, VotingError::ProposalNotActive);
        
        // Check if voting period has ended or if explicitly finalized by creator
        let current_time = Clock::get()?.unix_timestamp;
        let is_creator = ctx.accounts.authority.key() == proposal.creator;
        
        require!(
            current_time > proposal.end_time || is_creator,
            VotingError::VotingPeriodNotEnded
        );

        // Mark proposal as inactive
        proposal.is_active = false;

        emit!(ProposalFinalizedEvent {
            proposal_id: proposal.id,
            yes_votes: proposal.yes_votes,
            no_votes: proposal.no_votes,
            passed: proposal.yes_votes > proposal.no_votes,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 32, // discriminator + proposal_count + authority
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + 8 + 4 + 256 + 1024 + 32 + 8 + 8 + 8 + 1 + 8, // discriminator + id + title len + title + description len + description + creator + yes_votes + no_votes + end_time + is_active + total_voters
        seeds = [b"proposal", program_state.proposal_count.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + 1 + 32 + 8, // discriminator + has_voted + voter + vote
        seeds = [b"voter", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub voter_info: Account<'info, VoterInfo>,

    #[account(mut)]
    pub voter: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
pub struct ProgramState {
    pub proposal_count: u64,
    pub authority: Pubkey,
}

#[account]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub creator: Pubkey,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub end_time: i64,
    pub is_active: bool,
    pub total_voters: u64,
}

#[account]
pub struct VoterInfo {
    pub has_voted: bool,
    pub voter: Pubkey,
    pub vote: bool,
}

#[event]
pub struct ProposalCreatedEvent {
    pub proposal_id: u64,
    pub creator: Pubkey,
    pub title: String,
    pub end_time: i64,
}

#[event]
pub struct VoteCastEvent {
    pub proposal_id: u64,
    pub voter: Pubkey,
    pub vote: bool,
}

#[event]
pub struct ProposalFinalizedEvent {
    pub proposal_id: u64,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub passed: bool,
}

#[error_code]
pub enum VotingError {
    #[msg("Proposal is not active")]
    ProposalNotActive,
    
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    
    #[msg("Voting period has not ended yet")]
    VotingPeriodNotEnded,
    
    #[msg("User has already voted")]
    AlreadyVoted,
}