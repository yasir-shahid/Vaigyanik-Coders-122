const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DVoting contract to Polygon Mumbai testnet...");

  // Get the contract factory
  const DVoting = await ethers.getContractFactory("DVoting");

  // Deploy the contract
  const dvoting = await DVoting.deploy();

  // Wait for deployment to complete
  await dvoting.deployed();

  console.log("DVoting contract deployed to:", dvoting.address);
  console.log("Transaction hash:", dvoting.deployTransaction.hash);

  // Verify the contract on Polygonscan (optional)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await dvoting.deployTransaction.wait(6);
    
    console.log("Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: dvoting.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: dvoting.address,
    transactionHash: dvoting.deployTransaction.hash,
    network: network.name,
    deployedAt: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log(`Contract Address: ${deploymentInfo.contractAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Deployed At: ${deploymentInfo.deployedAt}`);
  console.log("\nSave this information for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });