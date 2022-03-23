import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
async function main() {
  const pool = await ethers.getContractAt("ETHPool", "0x458C535F14D754232D9029b92f63c77977a9A802");
  await pool.userDeposit({value: parseEther("1")});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});