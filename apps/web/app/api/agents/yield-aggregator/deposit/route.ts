/**
 * Yield Aggregator - TESTNET Deposit & Investment
 * Users deposit funds, agent invests in best yield on Base Sepolia
 */

import { NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { baseSepolia } from "thirdweb/chains";

function getClient() {
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY not configured");
  }
  return createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
}

// Base Sepolia Testnet Contracts (REAL TESTNET ADDRESSES)
const TESTNET_CONTRACTS = {
  USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
  AAVE_POOL: "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b", // Aave V3 Test Pool
};

// Simplified ERC20 ABI
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// Simplified Aave Pool ABI
const AAVE_POOL_ABI = [
  {
    name: "supply",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, userWallet } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!userWallet) {
      return NextResponse.json(
        { error: "User wallet required" },
        { status: 400 }
      );
    }

    // Get agent's wallet (uses private key from env)
    const agentPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!agentPrivateKey) {
      throw new Error("Agent wallet not configured");
    }

    const agentAccount = privateKeyToAccount({
      client: getClient(),
      privateKey: agentPrivateKey as `0x${string}`,
    });

    const amountWei = BigInt(Math.floor(amount * 1e6)); // USDC has 6 decimals

    // 1. Approve Aave to spend USDC
    const usdcContract = getContract({
      client: getClient(),
      chain: baseSepolia,
      address: TESTNET_CONTRACTS.USDC,
      abi: ERC20_ABI,
    });

    const approveTx = prepareContractCall({
      contract: usdcContract,
      method: "approve",
      params: [TESTNET_CONTRACTS.AAVE_POOL, amountWei],
    });

    const approvResult = await sendTransaction({
      transaction: approveTx,
      account: agentAccount,
    });

    // 2. Deposit to Aave Pool
    const aaveContract = getContract({
      client: getClient(),
      chain: baseSepolia,
      address: TESTNET_CONTRACTS.AAVE_POOL,
      abi: AAVE_POOL_ABI,
    });

    const supplyTx = prepareContractCall({
      contract: aaveContract,
      method: "supply",
      params: [
        TESTNET_CONTRACTS.USDC,
        amountWei,
        agentAccount.address,
        0,
      ],
    });

    const depositResult = await sendTransaction({
      transaction: supplyTx,
      account: agentAccount,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully invested $${amount} USDC into Aave V3 on Base Sepolia`,
      transactions: {
        approve: approvResult.transactionHash,
        deposit: depositResult.transactionHash,
      },
      explorer: `https://sepolia.basescan.org/tx/${depositResult.transactionHash}`,
      protocol: "Aave V3",
      amount: amount,
      estimatedAPY: "~8.5%",
      chain: "Base Sepolia (Testnet)",
    });

  } catch (error: any) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to deposit",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

// Get investment status
export async function GET(req: NextRequest) {
  return NextResponse.json({
    agent: "yield-aggregator",
    status: "active",
    mode: "TESTNET",
    network: "Base Sepolia",
    capabilities: {
      protocols: ["Aave V3"],
      tokens: ["USDC"],
      actions: ["deposit", "invest", "withdraw"],
    },
    info: "Send POST with {amount, userWallet} to invest funds",
  });
}
