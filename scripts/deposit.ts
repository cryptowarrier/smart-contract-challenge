import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const pool = await ethers.getContractAt("ETHPool", "0x458C535F14D754232D9029b92f63c77977a9A802");
  await pool.userDeposit({value: parseEther("1")});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});