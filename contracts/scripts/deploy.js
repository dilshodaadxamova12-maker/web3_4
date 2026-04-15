const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.deployContract("FuturisticNFT");

  await NFT.waitForDeployment();

  console.log(
    `FuturisticNFT deployed to: ${await NFT.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
