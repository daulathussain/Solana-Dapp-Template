import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";

const WalletContextProvider = ({ children }) => {
  const network = clusterApiUrl("devnet"); // You can change this to 'mainnet-beta' or 'testnet'
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;

// https://explorer.solana.com/tx/JMLrM1ngKwtYsBdnrL9hERCX9iqqV9nazrYsNLANxTgbp4dnW4vPmvoKv3S1JUdjHEdmXjZyef26mL386n2ovVP?cluster=devnet
