// scripts/deploy.js
import hre from "hardhat";

async function main() {
  const conn = await hre.network.connect(); // Hardhat v3
  const Factory = await conn.ethers.getContractFactory("Donatchain"); // שם החוזה בקובץ .sol
  const hub = await Factory.deploy();
  await hub.waitForDeployment();

  console.log("Deployer:", (await conn.ethers.provider.getSigner()).address);
  console.log("Donatchain deployed at:", await hub.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });
