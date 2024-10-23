// components/RealEstateDapp.js
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import idl from "../Context/idl.json";

const programId = new PublicKey("PEWDLGVG66cwYwjwppa4dtUXLmvwtqu5GyJrHKwcgEz");
const network = "https://api.devnet.solana.com";

const RealEstateDapp = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const [propertyId, setPropertyId] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [userProperties, setUserProperties] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState(null);

  // Create an Anchor provider and program instance
  const getProvider = () => {
    if (!wallet || !connection) {
      console.error("Wallet or connection is not available");
      return;
    }
    return new AnchorProvider(connection, wallet, {});
  };

  const program = new Program(idl, programId, getProvider());
  console.log(program);

  // Function to call the listProperty function
  const listProperty = async () => {
    if (!publicKey) return alert("Connect your wallet first");

    try {
      const propertyAccount = web3.Keypair.generate(); // Generate a new account for the property

      const transaction = new Transaction().add(
        program.instruction.listProperty(
          propertyId,
          new web3.BN(price),
          description,
          {
            accounts: {
              property: propertyAccount.publicKey,
              user: publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [propertyAccount],
          }
        )
      );

      await sendTransaction(transaction, connection, {
        signers: [propertyAccount],
      });
      alert("Property listed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to list property");
    }
  };

  // Function to call the buyProperty function
  const buyProperty = async () => {
    if (!publicKey || !propertyId)
      return alert("Provide property ID and connect your wallet");

    try {
      const transaction = new Transaction().add(
        program.instruction.buyProperty(propertyId, {
          accounts: {
            property: new PublicKey(propertyId),
            propertyOwner: new PublicKey("PROPERTY_OWNER_ADDRESS"), // Replace with actual address
            buyer: publicKey,
            systemProgram: SystemProgram.programId,
          },
        })
      );

      await sendTransaction(transaction, connection);
      alert("Property bought successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to buy property");
    }
  };

  // Function to call the sellProperty function
  const sellProperty = async () => {
    if (!publicKey || !propertyId || price <= 0)
      return alert("Provide details and connect your wallet");

    try {
      const transaction = new Transaction().add(
        program.instruction.sellProperty(propertyId, new web3.BN(price), {
          accounts: {
            property: new PublicKey(propertyId),
            seller: publicKey,
            systemProgram: SystemProgram.programId,
          },
        })
      );

      await sendTransaction(transaction, connection);
      alert("Property put up for sale successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to sell property");
    }
  };

  // Function to get properties by user
  const getPropertiesByUser = async () => {
    if (!publicKey) return alert("Connect your wallet first");

    try {
      const userPublicKey = publicKey.toString();
      const fetchedProperties = await program.account.property.all([
        {
          memcmp: {
            offset: 8, // Adjust according to the struct's layout
            bytes: userPublicKey,
          },
        },
      ]);

      setUserProperties(fetchedProperties.map((p) => p.account));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get property details
  const getPropertyDetails = async () => {
    if (!publicKey || !propertyId)
      return alert("Provide property ID and connect your wallet");

    try {
      const property = await program.account.property.fetch(
        new PublicKey(propertyId)
      );
      setPropertyDetails(property);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Real Estate Dapp</h1>
      <WalletMultiButton />
      {!publicKey ? (
        <p>Please connect your wallet to interact with the dapp.</p>
      ) : (
        <div>
          <h2>List Property</h2>
          <input
            type="text"
            placeholder="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={listProperty}>List Property</button>

          <h2>Buy Property</h2>
          <button onClick={buyProperty}>Buy Property</button>

          <h2>Sell Property</h2>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button onClick={sellProperty}>Sell Property</button>

          <h2>Your Properties</h2>
          <button onClick={getPropertiesByUser}>Fetch Properties</button>
          <ul>
            {userProperties.map((property, index) => (
              <li key={index}>{property.propertyId}</li>
            ))}
          </ul>

          <h2>Get Property Details</h2>
          <input
            type="text"
            placeholder="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />
          <button onClick={getPropertyDetails}>Get Details</button>
          {propertyDetails && (
            <div>
              <p>Owner: {propertyDetails.owner.toBase58()}</p>
              <p>Price: {propertyDetails.price.toNumber()}</p>
              <p>Description: {propertyDetails.description}</p>
              <p>Available: {propertyDetails.isAvailable ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealEstateDapp;
