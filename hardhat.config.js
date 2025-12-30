import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "london", // Use London EVM to avoid PUSH0 opcode
        },
      },
    ],
  },
  networks: {
    awakening: {
      type: "http",
      url: process.env.RPC_URL || "https://awakening.bdagscan.com/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
