import { expect } from "chai";
import { Contract, Signer, ethers } from "ethers";
import { fixture } from "./index";
import { network } from 'hardhat';
import { formatEther, parseEther } from "ethers/lib/utils";


describe("ETHPool", function () {
  let owner: Signer;
  let account1: Signer;
  let account2: Signer;
  let pool: Contract;
  const provider = network.provider;
  this.beforeEach(async() => {
    const fixtures = await fixture();
    owner = fixtures.owner;
    account1 = fixtures.account1;
    account2 = fixtures.account2;
    pool = fixtures.pool;
  });
  it("users can deposit their ethers", async () => {
    let poolBalance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    expect(poolBalance).to.eq(parseEther("0"));
    // deposit
    await pool.userDeposit({value: parseEther("100")});
    poolBalance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    console.log(formatEther(String(poolBalance)))
  });
});
