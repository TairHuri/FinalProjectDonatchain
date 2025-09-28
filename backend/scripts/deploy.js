const hre = require("hardhat");

async function main() {
  const DonationPlatform = await hre.ethers.getContractFactory("DonationPlatform");
  const donation = await DonationPlatform.deploy();
  await donation.deployed();
  console.log("DonationPlatform deployed to:", donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
