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
  it("can depoist reward by team account", async () => {
    await pool.registerTeamAccount(account2.getAddress(), true);
    await pool.connect(account2).depositReward({value: parseEther("100")});
    const totalReward = await pool.totalRewards();
    expect(totalReward).to.eq(parseEther("100"));
    const balance = await provider.request({method: 'eth_getBalance', params: [pool.address]});
    expect(balance).to.eq(totalReward);
  });
  it("does't allow to deposit reward by not team account", async () => {
    await expect(pool.depositReward({value: parseEther("100")})).to.revertedWith(
      'Not Team Account!'
    );
  });
  it("doesn't allow to harvest before unlock period", async () => {
    await pool.registerTeamAccount(account2.getAddress(), true);
    await pool.connect(account2).depositReward({value: parseEther("100")});
    await pool.userDeposit({value: parseEther("100")});
    await expect(pool.harvest()).to.revertedWith(
      "You can't harvest yet!"
    );
  });
  it("withdraw includes rewards", async () => {
    await pool.registerTeamAccount(account2.getAddress(), true);
    await pool.connect(account2).depositReward({value: parseEther("200")});
    await pool.userDeposit({value: parseEther("100")});
    await pool.connect(account1).userDeposit({value: parseEther("300")});
    // increase time
    await network.provider.send("evm_increaseTime", [86400 * 7]); 
    await network.provider.send("evm_mine");
    // withdraw
    const balance1 = await owner.getBalance();
    await pool.withdraw(parseEther("100"));
    const balance2 = await owner.getBalance();
    console.log(formatEther(balance2.sub(balance1)));
    const balance3 = await account1.getBalance();
    await pool.connect(account1).withdraw(parseEther("300"));
    const balance4 = await account1.getBalance();
    console.log(formatEther(balance4.sub(balance3)));
  });
});
