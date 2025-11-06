async function main() {
  const [deployer, underwriter, user1] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MockOracle = await ethers.getContractFactory("MockOracle");
  const mockOracle = await MockOracle.deploy();
  await mockOracle.deployed();
  console.log("MockOracle deployed to:", mockOracle.address);

  const DummyToken = await ethers.getContractFactory("DummyToken");
  const token = await DummyToken.deploy("Dummy", "DUM");
  await token.deployed();
  console.log("DummyToken deployed to:", token.address);

  const ClaimRegistry = await ethers.getContractFactory("ClaimRegistry");
  const registry = await ClaimRegistry.deploy(deployer.address, mockOracle.address, token.address);
  await registry.deployed();
  console.log("ClaimRegistry deployed to:", registry.address);

  const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
  const policy = await InsurancePolicy.deploy(deployer.address);
  await policy.deployed();
  console.log("InsurancePolicy deployed to:", policy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
