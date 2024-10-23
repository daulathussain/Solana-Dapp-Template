// /utils/connection.js
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import { useWallet } from "@solana/wallet-adapter-react";

// Set up Solana connection and program ID
const network = "https://api.devnet.solana.com";
const programID = new PublicKey("BZux6McmrjjyDHkYMtnoivgbsoKMRwRSficXMxcCVwR2"); // Update with your program ID
const opts = {
  preflightCommitment: "processed",
};

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const wallet = useWallet();
  return new Provider(connection, wallet, opts);
};

export const getProgram = () => {
  const provider = getProvider();
  return new Program(idl, programID, provider);
};
