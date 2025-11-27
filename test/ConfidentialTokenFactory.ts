import { expect } from "chai";
import { ethers } from "hardhat";
import { ConfidentialTokenFactory, ConfidentialToken } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ConfidentialTokenFactory", function () {
  let factory: ConfidentialTokenFactory;
  let deployer: HardhatEthersSigner;
  let alice: HardhatEthersSigner;

  beforeEach(async function () {
    [deployer, alice] = await ethers.getSigners();
    const factoryFactory = await ethers.getContractFactory("ConfidentialTokenFactory");
    factory = (await factoryFactory.deploy()) as ConfidentialTokenFactory;
    await factory.waitForDeployment();
  });

  it("creates a token with the default supply when zero is provided", async function () {
    await expect(factory.createToken("", "SYM", 0)).to.be.revertedWith("Name required");
    await expect(factory.createToken("Genesis", "", 0)).to.be.revertedWith("Symbol required");

    const tx = await factory.createToken("Genesis", "GEN", 0);
    await tx.wait();

    const count = await factory.getTokenCount();
    expect(count).to.eq(1n);

    const record = await factory.getToken(0);
    expect(record.totalSupply).to.eq(1_000_000_000n);
    expect(record.creator).to.eq(deployer.address);

    const token = (await ethers.getContractAt("ConfidentialToken", record.tokenAddress)) as ConfidentialToken;
    expect(await token.factory()).to.eq(await factory.getAddress());
    expect(await token.creator()).to.eq(deployer.address);
    expect(await token.initialSupply()).to.eq(1_000_000_000n);
  });

  it("tracks custom tokens per creator", async function () {
    await factory.createToken("Genesis", "GEN", 0);

    const customSupply = 5_000n;
    const tx = await factory.connect(alice).createToken("Alpha", "ALP", customSupply);
    await tx.wait();

    const aliceTokens = await factory.getTokensByCreator(alice.address);
    expect(aliceTokens.length).to.eq(1);
    expect(aliceTokens[0].symbol).to.eq("ALP");
    expect(aliceTokens[0].totalSupply).to.eq(customSupply);
    expect(aliceTokens[0].creator).to.eq(alice.address);

    const allTokens = await factory.getAllTokens();
    expect(allTokens.length).to.eq(2);
  });
});
