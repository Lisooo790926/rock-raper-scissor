import { AutonomousAgent, RockPaperScissors } from "../typechain-types";
import { task } from "hardhat/config";

const DEFAULT_ROCKPC_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const DEFAULT_AA_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

task("playGame", "Play with the AutonomousAgent contract", async (_, { ethers }) => {
    const aaAddress = process.env.AA_ADDRESS ?? DEFAULT_AA_ADDRESS;
    const rockPaperScissorsAddress = process.env.ROCK_PAPER_SCISSORS_ADDRESS ?? DEFAULT_ROCKPC_ADDRESS;

    // Get contract instance
    const AutonomousAgent = await ethers.getContractFactory("AutonomousAgent");
    const autonomousAgent = AutonomousAgent.attach(aaAddress) as AutonomousAgent;

    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = RockPaperScissors.attach(rockPaperScissorsAddress) as RockPaperScissors;
    const event = rockPaperScissors.getEvent("GameResult")
    await rockPaperScissors.on(event, (gameId, player, computerChoice, playerChoice, playerWon) => {
        console.log('Game result:', gameId, player, computerChoice, playerChoice, playerWon);
    });

    const [player] = await ethers.getSigners();
    try {
        const tx = await autonomousAgent.connect(player).playGame(0).then((tx) => tx.wait());
        console.log('Game finish', tx?.hash);
    } catch (error) {
        console.error('Error playing the game:', error);
    }
}