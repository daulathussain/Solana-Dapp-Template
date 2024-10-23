import "../styles/globals.css";

import WalletContextProvider from "../Context/WalletContextProvider";

export default function App({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}
