const hre = require("hardhat");

async function main() {
  console.log("Deploying CryptoLottery contract to Sepolia...");

  // Sepolia Testnet Chainlink Configuration
  const VRF_COORDINATOR_V2 = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
  const GAS_LANE = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
  const CALLBACK_GAS_LIMIT = 500000;
  const SUBSCRIPTION_ID = process.env.VRF_SUBSCRIPTION_ID || 0; // You need to create this
  const ETH_USD_PRICE_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

  if (SUBSCRIPTION_ID === 0) {
    console.log("\n⚠️  WARNING: VRF_SUBSCRIPTION_ID not set in .env file!");
    console.log("Please create a VRF subscription at https://vrf.chain.link/");
    console.log("And add VRF_SUBSCRIPTION_ID to your .env file\n");
  }

  const CryptoLottery = await hre.ethers.getContractFactory("CryptoLottery");
  const lottery = await CryptoLottery.deploy(
    VRF_COORDINATOR_V2,
    SUBSCRIPTION_ID,
    GAS_LANE,
    CALLBACK_GAS_LIMIT,
    ETH_USD_PRICE_FEED
  );

  await lottery.waitForDeployment();
  const address = await lottery.getAddress();

  console.log(`✅ CryptoLottery deployed to: ${address}`);
  console.log("\n📝 Next steps:");
  console.log("1. Add this contract as a consumer to your VRF subscription");
  console.log("2. Fund your VRF subscription with LINK tokens");
  console.log("3. Register the contract with Chainlink Automation (Keepers)");
  console.log("4. Update the contract address in your frontend configuration");
  console.log(`\n🔗 View on Etherscan: https://sepolia.etherscan.io/address/${address}`);

  // Wait for block confirmations before verifying
  console.log("\nWaiting for block confirmations...");
  await lottery.deploymentTransaction().wait(6);

  // Verify contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nVerifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [
          VRF_COORDINATOR_V2,
          SUBSCRIPTION_ID,
          GAS_LANE,
          CALLBACK_GAS_LIMIT,
          ETH_USD_PRICE_FEED,
        ],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

