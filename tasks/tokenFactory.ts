import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:factory-address", "Prints the ConfidentialTokenFactory address").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { deployments } = hre;
    const factory = await deployments.get("ConfidentialTokenFactory");
    console.log(`ConfidentialTokenFactory address is ${factory.address}`);
  },
);

task("task:create-token", "Creates a confidential token")
  .addParam("name", "Token name")
  .addParam("symbol", "Token symbol")
  .addOptionalParam("supply", "Initial supply (defaults to 1,000,000,000)", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const factoryDeployment = await deployments.get("ConfidentialTokenFactory");
    const signer = (await ethers.getSigners())[0];
    const factory = await ethers.getContractAt("ConfidentialTokenFactory", factoryDeployment.address);

    const supplyString = taskArguments.supply as string;
    let supply = BigInt(0);
    if (supplyString && supplyString !== "0") {
      supply = BigInt(supplyString);
    }

    const tx = await factory.connect(signer).createToken(taskArguments.name, taskArguments.symbol, supply);
    console.log(`Creating token... tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Token created in block ${receipt?.blockNumber}`);
  });

task("task:list-tokens", "Lists all confidential tokens created through the factory").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const factoryDeployment = await deployments.get("ConfidentialTokenFactory");
    const factory = await ethers.getContractAt("ConfidentialTokenFactory", factoryDeployment.address);
    const tokens = await factory.getAllTokens();

    if (tokens.length === 0) {
      console.log("No tokens created yet.");
      return;
    }

    tokens.forEach((token: any, index: number) => {
      console.log(
        `${index + 1}. ${token.name} (${token.symbol}) at ${token.tokenAddress} | creator: ${token.creator} | supply: ${
          token.totalSupply
        }`,
      );
    });
  },
);
