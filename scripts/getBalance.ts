import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils';
import { parseEther } from "ethers/lib/utils";
async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
  const balance = await provider.getBalance("0x458C535F14D754232D9029b92f63c77977a9A802");
  console.log(formatEther(balance));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});