// /utils/propertyFunctions.js
import { getProgram } from "./connection";
import { PublicKey } from "@solana/web3.js";

// List a property
export const listProperty = async (propertyId, price, description) => {
  try {
    const program = getProgram();
    const provider = program.provider;
    const [propertyPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(propertyId)],
      program.programId
    );

    await program.rpc.listProperty(propertyId, price, description, {
      accounts: {
        property: propertyPDA,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [],
    });
    console.log("Property listed successfully!");
  } catch (error) {
    console.error("Error listing property:", error);
  }
};

// Buy a property
export const buyProperty = async (propertyId) => {
  try {
    const program = getProgram();
    const provider = program.provider;
    const [propertyPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(propertyId)],
      program.programId
    );

    const propertyAccount = await program.account.property.fetch(propertyPDA);

    await program.rpc.buyProperty({
      accounts: {
        property: propertyPDA,
        propertyOwner: propertyAccount.owner,
        buyer: provider.wallet.publicKey,
      },
      signers: [],
    });
    console.log("Property bought successfully!");
  } catch (error) {
    console.error("Error buying property:", error);
  }
};

// Sell a property
export const sellProperty = async (propertyId, price) => {
  try {
    const program = getProgram();
    const provider = program.provider;
    const [propertyPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(propertyId)],
      program.programId
    );

    await program.rpc.sellProperty(price, {
      accounts: {
        property: propertyPDA,
        seller: provider.wallet.publicKey,
      },
      signers: [],
    });
    console.log("Property put up for sale!");
  } catch (error) {
    console.error("Error selling property:", error);
  }
};

// Fetch property details
export const getPropertyDetails = async (propertyId) => {
  try {
    const program = getProgram();
    const [propertyPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(propertyId)],
      program.programId
    );

    const property = await program.account.property.fetch(propertyPDA);
    return property;
  } catch (error) {
    console.error("Error fetching property details:", error);
  }
};

// Fetch properties by user
export const getPropertiesByUser = async (userPubKey) => {
  try {
    const program = getProgram();
    const properties = await program.rpc.getPropertiesByUser(userPubKey);
    return properties;
  } catch (error) {
    console.error("Error fetching user properties:", error);
  }
};
