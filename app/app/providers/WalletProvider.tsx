"use client"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useMemo } from 'react';

// Default styles for wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

const SolanaWalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // Choose your Solana network (Devnet for testing)
  const network = WalletAdapterNetwork.Devnet;

  // Endpoint can be customized via an environment variable or default to the cluster URL
  const endpoint = useMemo(() => {
    // Try to use the environment variable first
    const envEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (envEndpoint) {
      try {
        new URL(envEndpoint);
        return envEndpoint;
      } catch (e) {
        console.warn('Invalid RPC URL in environment variables, falling back to default');
      }
    }
    // Fall back to cluster URL
    return clusterApiUrl(network);
  }, [network]);

  // Specify supported wallets with configuration
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          console.error('Wallet error:', error);
          // You can add custom error handling here, like showing a toast notification
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
