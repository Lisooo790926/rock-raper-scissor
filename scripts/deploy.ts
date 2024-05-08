import { ethers } from 'hardhat';

async function main() {
    const [owner] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        owner.address
    );

    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = await RockPaperScissors.deploy();
    const rockPaperScissorsAddress = await rockPaperScissors.getAddress();
    console.log("RockPaperScissors address:", rockPaperScissorsAddress);

    const AAContract = await ethers.getContractFactory("AutonomousAgent");
    const aaContract = await AAContract.deploy(rockPaperScissors.getAddress());
    const aaAddress = await aaContract.getAddress();
    console.log("AAContract address:", aaAddress);

    // init the fund
    await owner.sendTransaction({ to: rockPaperScissorsAddress, value: ethers.parseEther("0.1") })
        .then((tx) => tx.wait());
        
    await owner.sendTransaction({ to: aaAddress, value: ethers.parseEther("0.1") })
        .then((tx) => tx.wait());
}

main().catch((error) => {
    console.error("Unknown error", error);
    process.exitCode = 1;
});
