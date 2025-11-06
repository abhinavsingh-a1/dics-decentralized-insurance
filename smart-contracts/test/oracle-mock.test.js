const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = require("ethers");

describe("MockOracle", function () {
  let MockOracle, mockOracle, admin;

  beforeEach(async function () {
    [admin] = await ethers.getSigners();
    MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy();
    await mockOracle.waitForDeployment();
  });

  it("emits request event", async function () {
    const req = ethers.keccak256(toUtf8Bytes("req1"));
    await expect(mockOracle.requestData(req, "endpoint"))
      .to.emit(mockOracle, "OracleRequested")
      .withArgs(req, "endpoint");
  });
});
