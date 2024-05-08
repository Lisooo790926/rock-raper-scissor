import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = await RockPaperScissors.deploy();

    console.log("RockPaperScissors address:", rockPaperScissors.getAddress());
}

main().catch((error) => {
    console.error("Unknown error", error);
    process.exitCode = 1;
});
