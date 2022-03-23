import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { fixture } from "./index";


describe("ETHPool", function () {
  let owner: Signer;
  let account1: Signer;
  let account2: Signer;
  let pool: Contract;
  this.beforeEach(async() => {
    const fixtures = await fixture();
    owner = fixtures.owner;
    account1 = fixtures.account1;
    account2 = fixtures.account2;
    pool = fixtures.pool;
  });
  it("users can deposit their ethers", async () => {
    await 
  });
});
