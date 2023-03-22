// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 const Faucet = await hre.ethers.getContractFactory("Faucet");
 const faucet = await Faucet.deploy('0xF54976cbF1AD686cd3F1EAc526c957F6D2904216');
 console.log("deploying....")

 await faucet.deployed();
 console.log("Faucet Contract deployed to: ",faucet.address);
// Faucet Contract deployed to:  0x48fCdF49c83F2cad3ADA1771179924B21a04d587

 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
