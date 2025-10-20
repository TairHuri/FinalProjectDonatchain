// src/wallet.tsx
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'DonatChain',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string, // ל-WalletConnect
  chains: [sepolia],
  ssr: false,
});
const qc = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={false}
        >{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
