import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { AutonomousAgent, RockPaperScissors } from "./typechain-types";

const DEFAULT_PRIVATE_KEY =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    local: {
        url: 'http://127.0.0.1:8545',
        blockGasLimit: 12000000,
        accounts: [DEFAULT_PRIVATE_KEY],
    },
    dev: {
        url: `https://sepolia.infura.io/v3/${process.env.ETH_PROVIDER_URL}` ?? '',
        accounts: [process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY],
    }
  }
};

const DEFAULT_ROCKPC_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const DEFAULT_AA_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

task("playGame", "Play with the AutonomousAgent contract", async (_, { ethers }) => {
    const aaAddress = process.env.AA_ADDRESS ?? DEFAULT_AA_ADDRESS;
    const rockPaperScissorsAddress = process.env.ROCK_PAPER_SCISSORS_ADDRESS ?? DEFAULT_ROCKPC_ADDRESS;

    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = RockPaperScissors.attach(rockPaperScissorsAddress) as RockPaperScissors;
    const event = rockPaperScissors.getEvent("GameResult")
    await rockPaperScissors.on(event, (gameId, player, computerChoice, playerChoice, playerWon) => {
        console.log('Game result:', gameId, player, computerChoice, playerChoice, playerWon);
    });

    console.log('Playing game with AutonomousAgent contract:', aaAddress);
    const AutonomousAgent = await ethers.getContractFactory("AutonomousAgent");
    const autonomousAgent = AutonomousAgent.attach(aaAddress) as AutonomousAgent;

    const [player] = await ethers.getSigners();
    try {
        const tx = await autonomousAgent.connect(player).playGame(2).then((tx) => tx.wait());
        console.log('Game finish', tx?.hash);

        await new Promise((_) => {
          setTimeout(() => {
            console.log("wait until the event");
            rockPaperScissors.off(event);
          }, 10000);
        });
    } catch (error) {
        console.error('Error playing the game:', error);
    }
});

export default config;
