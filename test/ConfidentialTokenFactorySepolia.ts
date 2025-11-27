import { expect } from "chai";
import { ethers, deployments, fhevm } from "hardhat";
import { ConfidentialTokenFactory } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ConfidentialTokenFactorySepolia", function () {
  let factory: ConfidentialTokenFactory;
  let signer: HardhatEthersSigner;

  before(async function () {
    if (fhevm.isMock) {
      this.skip();
    }

    try {
      const deployment = await deployments.get("ConfidentialTokenFactory");
      factory = (await ethers.getContractAt(
        "ConfidentialTokenFactory",
        deployment.address,
      )) as ConfidentialTokenFactory;
    } catch (err) {
      (err as Error).message += ". Deploy the contract first with 'npx hardhat deploy --network sepolia'";
      throw err;
    }

    signer = (await ethers.getSigners())[0];
  });

  it("creates a token on Sepolia", async function () {
    this.timeout(4 * 60_000);

    const countBefore = await factory.getTokenCount();
    const timestamp = Math.floor(Date.now() / 1000);
    const tx = await factory
      .connect(signer)
      .createToken(`Sepolia Token ${timestamp}`, `ST${timestamp % 1000}`, 5);
    await tx.wait();
    const countAfter = await factory.getTokenCount();

    expect(countAfter).to.eq(countBefore + 1n);
  });
});
