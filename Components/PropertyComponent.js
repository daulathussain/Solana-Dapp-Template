// // /components/PropertyComponent.js
// import { useWallet } from "@solana/wallet-adapter-react";
// import { getProgram } from "./connection";
// import { PublicKey } from "@solana/web3.js";

// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; // Import Solana wallet button

// const PropertyComponent = () => {
//   const { publicKey, connected, connect } = useWallet();

//   // List a property
//   const listProperty = async (propertyId, price, description) => {
//     try {
//       const program = getProgram();
//       const provider = program.provider;
//       const [propertyPDA] = await PublicKey.findProgramAddress(
//         [Buffer.from(propertyId)],
//         program.programId
//       );

//       await program.rpc.listProperty(propertyId, price, description, {
//         accounts: {
//           property: propertyPDA,
//           user: provider.wallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         },
//         signers: [],
//       });
//       console.log("Property listed successfully!");
//     } catch (error) {
//       console.error("Error listing property:", error);
//     }
//   };

//   // Buy a property
//   const buyProperty = async (propertyId) => {
//     try {
//       const program = getProgram();
//       const provider = program.provider;
//       const [propertyPDA] = await PublicKey.findProgramAddress(
//         [Buffer.from(propertyId)],
//         program.programId
//       );

//       const propertyAccount = await program.account.property.fetch(propertyPDA);

//       await program.rpc.buyProperty({
//         accounts: {
//           property: propertyPDA,
//           propertyOwner: propertyAccount.owner,
//           buyer: provider.wallet.publicKey,
//         },
//         signers: [],
//       });
//       console.log("Property bought successfully!");
//     } catch (error) {
//       console.error("Error buying property:", error);
//     }
//   };

//   // Sell a property
//   const sellProperty = async (propertyId, price) => {
//     try {
//       const program = getProgram();
//       const provider = program.provider;
//       const [propertyPDA] = await PublicKey.findProgramAddress(
//         [Buffer.from(propertyId)],
//         program.programId
//       );

//       await program.rpc.sellProperty(price, {
//         accounts: {
//           property: propertyPDA,
//           seller: provider.wallet.publicKey,
//         },
//         signers: [],
//       });
//       console.log("Property put up for sale!");
//     } catch (error) {
//       console.error("Error selling property:", error);
//     }
//   };

//   // Fetch property details
//   const getPropertyDetails = async (propertyId) => {
//     try {
//       const program = getProgram();
//       const [propertyPDA] = await PublicKey.findProgramAddress(
//         [Buffer.from(propertyId)],
//         program.programId
//       );

//       const property = await program.account.property.fetch(propertyPDA);
//       return property;
//     } catch (error) {
//       console.error("Error fetching property details:", error);
//     }
//   };

//   // Fetch properties by user
//   const getPropertiesByUser = async (userPubKey) => {
//     try {
//       const program = getProgram();
//       const properties = await program.rpc.getPropertiesByUser(userPubKey);
//       return properties;
//     } catch (error) {
//       console.error("Error fetching user properties:", error);
//     }
//   };

//   // Function to connect wallet if not connected
//   const connectWallet = async () => {
//     if (!connected) {
//       try {
//         await connect();
//         console.log("Wallet connected!");
//       } catch (error) {
//         console.error("Error connecting wallet:", error);
//       }
//     } else {
//       console.log("Wallet already connected");
//     }
//   };

//   const handleListProperty = async () => {
//     if (!connected) {
//       console.error("Please connect your wallet");
//       return;
//     }
//     const propertyId = "property1";
//     const price = 1000;
//     const description = "A beautiful house in Solana";
//     await listProperty(propertyId, price, description);
//   };

//   const handleBuyProperty = async () => {
//     if (!connected) {
//       console.error("Please connect your wallet");
//       return;
//     }
//     const propertyId = "property1";
//     await buyProperty(propertyId);
//   };

//   const handleSellProperty = async () => {
//     if (!connected) {
//       console.error("Please connect your wallet");
//       return;
//     }
//     const propertyId = "property1";
//     const price = 1200;
//     await sellProperty(propertyId, price);
//   };

//   const handleGetPropertyDetails = async () => {
//     if (!connected) {
//       console.error("Please connect your wallet");
//       return;
//     }
//     const propertyId = "property1";
//     const details = await getPropertyDetails(propertyId);
//     console.log("Property Details:", details);
//   };

//   return (
//     <div>
//       <h2>Solana Real Estate Dapp</h2>
//       <WalletMultiButton />
//       <button onClick={handleListProperty}>List Property</button>
//       <button onClick={handleBuyProperty}>Buy Property</button>
//       <button onClick={handleSellProperty}>Sell Property</button>
//       <button onClick={handleGetPropertyDetails}>Get Property Details</button>
//     </div>
//   );
// };

// export default PropertyComponent;

// /components/PropertyComponent.js
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; // Import Solana wallet button
import {
  listProperty,
  buyProperty,
  sellProperty,
  getPropertyDetails,
} from "../Components/propertyFunctions";

const PropertyComponent = () => {
  const { publicKey, connected, connect } = useWallet();

  useEffect(() => {
    if (connected) {
      console.log("Wallet connected!", publicKey.toBase58());
    }
  }, [connected, publicKey]);

  // Function to connect wallet if not connected
  const connectWallet = async () => {
    if (!connected) {
      try {
        await connect();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const handleListProperty = async () => {
    if (!connected) {
      console.error("Please connect your wallet");
      return;
    }
    const propertyId = "property1";
    const price = 1000;
    const description = "A beautiful house in Solana";

    try {
      await listProperty(propertyId, price, description);
      console.log("Property listed successfully!");
    } catch (error) {
      console.error("Error listing property:", error);
    }
  };

  const handleBuyProperty = async () => {
    if (!connected) {
      console.error("Please connect your wallet");
      return;
    }
    const propertyId = "property1";
    try {
      await buyProperty(propertyId);
      console.log("Property purchased successfully!");
    } catch (error) {
      console.error("Error buying property:", error);
    }
  };

  const handleSellProperty = async () => {
    if (!connected) {
      console.error("Please connect your wallet");
      return;
    }
    const propertyId = "property1";
    const price = 1200;
    try {
      await sellProperty(propertyId, price);
      console.log("Property sold successfully!");
    } catch (error) {
      console.error("Error selling property:", error);
    }
  };

  const handleGetPropertyDetails = async () => {
    if (!connected) {
      console.error("Please connect your wallet");
      return;
    }
    const propertyId = "property1";
    try {
      const details = await getPropertyDetails(propertyId);
      console.log("Property Details:", details);
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  return (
    <div>
      <h2>Solana Real Estate Dapp</h2>
      {!connected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Wallet Connected: {publicKey.toBase58()}</p>
      )}
      <WalletMultiButton /> {/* Provides a wallet connect button UI */}
      <button onClick={handleListProperty}>List Property</button>
      <button onClick={handleBuyProperty}>Buy Property</button>
      <button onClick={handleSellProperty}>Sell Property</button>
      <button onClick={handleGetPropertyDetails}>Get Property Details</button>
    </div>
  );
};

export default PropertyComponent;
