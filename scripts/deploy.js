import hre from "hardhat";

async function main() {
  console.log("Deploying CryptoLottery contract to Sepolia...");

  // Sepolia Testnet Chainlink VRF v2.5 Configuration
  // The VRF Coordinator is hardcoded in the contract: 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
  const SUBSCRIPTION_ID = process.env.VRF_SUBSCRIPTION_ID ? BigInt(process.env.VRF_SUBSCRIPTION_ID) : 0n;

  if (SUBSCRIPTION_ID === 0n || !process.env.VRF_SUBSCRIPTION_ID) {
    console.log("\n⚠️  WARNING: VRF_SUBSCRIPTION_ID not set in .env file!");
    console.log("Please create a VRF subscription at https://vrf.chain.link/");
    console.log("And add VRF_SUBSCRIPTION_ID to your .env file\n");
    console.log("Continuing with SUBSCRIPTION_ID = 0 (you'll need to update this later)\n");
  }

  console.log("Deployment Configuration:");
  console.log("- VRF Coordinator: 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B (hardcoded in contract)");
  console.log("- Subscription ID:", SUBSCRIPTION_ID.toString());
  console.log("");

  const CryptoLottery = await hre.ethers.getContractFactory("CryptoLottery");
  const lottery = await CryptoLottery.deploy(SUBSCRIPTION_ID);

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
        constructorArguments: [SUBSCRIPTION_ID.toString()],
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

