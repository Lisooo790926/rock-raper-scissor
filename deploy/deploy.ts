import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = await RockPaperScissors.deploy();

    console.log("RockPaperScissors address:", rockPaperScissors.address);
}

main().catch((error) => {
    console.error("Unknown error", error);
    process.exitCode = 1;
});
