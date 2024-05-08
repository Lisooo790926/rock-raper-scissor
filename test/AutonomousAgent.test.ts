import { expect } from "chai";
import { ethers } from "hardhat";
import { AutonomousAgent, RockPaperScissors } from "../typechain-types";

describe("AutonomousAgent", function () {
    let rockPaperScissors: RockPaperScissors;
    let autonomousAgent: AutonomousAgent;

    before(async function () {
        const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
        rockPaperScissors = await RockPaperScissors.deploy();
        
        // listen to event
        const event = rockPaperScissors.getEvent("GameResult")
        await rockPaperScissors.on(event, (gameId, player, computerChoice, playerChoice, playerWon) => {
            console.log('Game result:', gameId, player, computerChoice, playerChoice, playerWon);
        });

        const AutonomousAgent = await ethers.getContractFactory("AutonomousAgent");
        autonomousAgent = await AutonomousAgent.deploy(await rockPaperScissors.getAddress());

        const [owner] = await ethers.getSigners();
        await owner.sendTransaction({ to: rockPaperScissors, value: ethers.parseEther("0.1") })
            .then((tx) => tx.wait());

        await owner.sendTransaction({ to: autonomousAgent, value: ethers.parseEther("0.1") })
            .then((tx) => tx.wait());
    });

    describe("Gameplay", function () {
        it("Should accept a play the game with no entry fee", async function () {
            const [_, otherAccount] = await ethers.getSigners();
            const tx = await autonomousAgent.connect(otherAccount).playGame(0)
            const blockTime = await getBlockTimestamp(tx.blockHash!);
            const computerPlay = blockTime % 3;
            
            await expect(tx).to.emit(rockPaperScissors, "GameResult")
                .withArgs(0, await autonomousAgent.getAddress(), computerPlay, 0, isWin(0, computerPlay));
        });
    });
});


async function getBlockTimestamp(blockHash: string): Promise<number> {
    const block = await ethers.provider.getBlock(blockHash);
    return block?.timestamp ?? 0;
}

function isWin(mine: number, yours: number): boolean {
    return mine === 0 && yours === 2 || mine === 1 && yours === 0 || mine === 2 && yours === 1;
}
