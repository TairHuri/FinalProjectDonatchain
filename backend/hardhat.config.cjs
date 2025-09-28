require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: { type: "edr-simulated" },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY",
      accounts: ["0xYOUR_PRIVATE_KEY"]
    },
  },
};
