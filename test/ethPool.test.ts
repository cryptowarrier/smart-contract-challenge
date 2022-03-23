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
    expect(Number(poolBalance)).to.eq(0);
    // deposit
    await pool.userDeposit({value: parseEther("100")});
    poolBalance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    expect(poolBalance).to.eq(parseEther("100"));
    await pool.connect(account1).userDeposit({value: parseEther("50")});
    poolBalance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    expect(poolBalance).to.eq(parseEther("150"));
  });
  it("users can deposit and withdraw any time", async () => {
    await pool.userDeposit({value: parseEther("100")});
    await pool.withdraw(parseEther("50"));
    const balance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    expect(balance).to.eq(parseEther("50"));
  });
  it("owner can add/remove team account", async () => {
    await pool.registerTeamAccount(account2.getAddress(), true);
    const teamAccount = await pool.teamAtIndex(0);
    expect(teamAccount).to.eq(await account2.getAddress());
    await pool.registerTeamAccount(account2.getAddress(), false);
    await expect(pool.teamAtIndex(0)).to.reverted;
  });
  it("doesn't allow to add team account by not owner", async () => {
    await expect(pool.connect(account1).registerTeamAccount(account2.getAddress(), true)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
