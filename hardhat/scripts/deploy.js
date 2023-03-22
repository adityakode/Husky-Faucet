// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 const HuskyToken = await hre.ethers.getContractFactory("HuskyToken")
 const huskyToken = await HuskyToken.deploy(100000000,50);

 await huskyToken.deployed();
 console.log("Contract deployed to: ",huskyToken.address)
 //Contract deployed to:  0xF54976cbF1AD686cd3F1EAc526c957F6D2904216
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
