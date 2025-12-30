import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function main() {
  console.log("🚀 Deploying StakeInNature contract...");
  console.log("RPC URL:", process.env.RPC_URL);
  console.log("Private Key exists:", !!process.env.PRIVATE_KEY);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying from account:", wallet.address);
  console.log("Account balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");

  const contractPath = path.join(__dirname, "../artifacts/contracts/StakeInNature.sol/StakeInNature.json");
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  // Define initial supply: 1,000,000 SIN tokens (with 18 decimals)
  const initialSupply = ethers.parseUnits("1000000", 18);

  console.log("\n📝 Contract Parameters:");
  console.log("- Initial Supply:", ethers.formatUnits(initialSupply, 18), "SIN");

  const contractFactory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
  
  console.log("\n⏳ Deploying contract...");
  const contract = await contractFactory.deploy(initialSupply);
  
  console.log("⏳ Waiting for deployment confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ StakeInNature deployed successfully!");
  console.log("\nDeployment Details:");
  console.log("- Contract Address:", contractAddress);
  console.log("- Initial Supply: 1,000,000 SIN");
  console.log("- Minimum Stake: 1,000 SIN");
  console.log("- Reward Percentage: 8%");
  console.log("- Owner:", wallet.address);
  console.log("- Network:", (await provider.getNetwork()).name);
  console.log("- Chain ID:", (await provider.getNetwork()).chainId);

  // Save deployment info to a file
  const deploymentInfo = {
    contractAddress,
    owner: wallet.address,
    network: (await provider.getNetwork()).name,
    chainId: Number((await provider.getNetwork()).chainId),
    deploymentTime: new Date().toISOString(),
    initialSupply: ethers.formatUnits(initialSupply, 18)
  };

  const deploymentPath = path.join(__dirname, "../deployment-info.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });