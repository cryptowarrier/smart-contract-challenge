import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

interface Fixture {
  owner: Signer;
  account1: Signer;
  account2: Signer;
  pool: Contract;
}


export async function fixture(): Promise <Fixture> {
  const [ owner, account1, account2 ] = await ethers.getSigners();
  const Pool = await ethers.getContractFactory("ETHPool");
  const pool = await Pool.deploy(parseEther("10"));
  await pool.deployed();
  return {
    owner,
    account1,
    account2,
    pool
  };
}