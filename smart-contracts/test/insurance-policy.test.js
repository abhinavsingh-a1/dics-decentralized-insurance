const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsurancePolicy", function () {
  let InsurancePolicy, insurancePolicy, admin, user1;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
    insurancePolicy = await InsurancePolicy.deploy(admin.address);
    await insurancePolicy.waitForDeployment();
  });

  it("registers and returns policy", async function () {
    await insurancePolicy.connect(admin).registerPolicy(42, user1.address, 0, 9999999999, "meta");
    const p = await insurancePolicy.getPolicy(42);
    expect(p.policyId).to.equal(42);
    expect(p.holder).to.equal(user1.address);
  });

  it("prevents duplicate registration", async function () {
    await insurancePolicy.connect(admin).registerPolicy(100, user1.address, 0, 9999999999, "meta");
    await expect(insurancePolicy.connect(admin).registerPolicy(100, user1.address, 0, 9999999999, "meta")).to.be.revertedWith("Policy already exists");
  });
});
