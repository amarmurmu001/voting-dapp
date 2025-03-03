export interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  yesVotes: number;
  noVotes: number;
  status: 'active' | 'completed' | 'pending';
  createdAt: number;
  endTime?: number;
} 