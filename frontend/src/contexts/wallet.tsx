// src/wallet.tsx

// Import default RainbowKit styles (required for wallet UI)
import '@rainbow-me/rainbowkit/styles.css';

// Import RainbowKit and configuration helper
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';

// Wagmi is the core Ethereum hooks library
import { WagmiProvider } from 'wagmi';

// Import blockchain network configuration (Sepolia testnet)
import { sepolia } from 'wagmi/chains';

// React Query is used by Wagmi internally for caching and requests
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create Wagmi + RainbowKit configuration
const config = getDefaultConfig({
  appName: 'DonatChain', // App name shown in wallet connect modal

  // WalletConnect project ID (from .env file)
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string,

  // Supported chains (Sepolia is a public Ethereum testnet)
  chains: [sepolia],

  // Disable server-side rendering (for Vite / client-only app)
  ssr: false,
});

// Create React Query client (used by Wagmi for async data management)
const qc = new QueryClient();

// Main Web3 provider wrapper component
export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    // Provides blockchain connection and wallets to the entire app
    <WagmiProvider config={config}>

      {/* React Query provider for async data caching */}
      <QueryClientProvider client={qc}>

        {/* RainbowKit provides UI for wallet connection */}
        <RainbowKitProvider
          modalSize="compact"             // Smaller wallet modal
          showRecentTransactions={false}  // Hide transaction history UI
        >
          {/* All children will have access to Web3 and wallet context */}
          {children}
        </RainbowKitProvider>

      </QueryClientProvider>
    </WagmiProvider>
  );
}
