import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { AutonomousAgent } from "./typechain-types";
import { AA_ADDRESS, DEFAULT_PRIVATE_KEY, ETH_PROVIDER_API_KEY, PRIVATE_KEY, ROCK_PAPER_SCISSORS_ADDRESS } from "./scripts/constants";
import { createAcount } from "./scripts/account";
import { deposit } from "./scripts/deposit";
import { SendUserOperationResult } from "@alchemy/aa-core";
import { waitForTxn } from "./scripts/waitTxn";

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    local: {
        url: 'http://127.0.0.1:8545',
        blockGasLimit: 12000000,
        accounts: [DEFAULT_PRIVATE_KEY],
    },
    dev: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${ETH_PROVIDER_API_KEY}`,
        accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};

export default config;

///////////////////////////// tasks /////////////////////////////

task("createSCA", "Create smart contract wallet", async (_, { ethers }) => {
  const scAccount = await createAcount();
  console.log('Account created:', scAccount.getAddress());

  const txHash = await deposit(scAccount.getAddress(), '0.01');
  console.log('Deposit successfully', txHash);
});

task("transfer", "Transfer amount back to owner address ", async (_, { ethers }) => {

  const scAccount = await createAcount();
  const [mine] = await ethers.getSigners();
  const result: SendUserOperationResult = await scAccount.sendUserOperation({
    uo: {
      target: mine.address,
      data: "0x",
      value: ethers.parseEther("0.001")
    },
  });

  console.log("User operation result: ", result);
  
  await waitForTxn(scAccount, result);
});

task("playGameAA", "Play with the AA Wallet", async (_, { ethers }) => {

  const scAccount = await createAcount();
  const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
  const rockPaperScissors = RockPaperScissors.attach(ROCK_PAPER_SCISSORS_ADDRESS);
  console.log('Playing game with RockPaperScissors contract:', ROCK_PAPER_SCISSORS_ADDRESS);
  const calldata = rockPaperScissors.interface.encodeFunctionData('play', [1]);
  const result: SendUserOperationResult = await scAccount.sendUserOperation({
    uo: {
      target: ROCK_PAPER_SCISSORS_ADDRESS,
      data: calldata,
      value: ethers.parseEther("0.001")
    },
  });

  console.log("User operation result: ", result);
  await waitForTxn(scAccount, result);
});

task("playGame", "Play with the AutonomousAgent contract", async (_, { ethers }) => {
    const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    const rockPaperScissors = RockPaperScissors.attach(ROCK_PAPER_SCISSORS_ADDRESS);
    console.log('Playing game with RockPaperScissors contract:', ROCK_PAPER_SCISSORS_ADDRESS);
    
    const AutonomousAgent = await ethers.getContractFactory("AutonomousAgent");
    const autonomousAgent = AutonomousAgent.attach(AA_ADDRESS) as AutonomousAgent;
    console.log('Playing game with AutonomousAgent contract:', AA_ADDRESS);

    const [player] = await ethers.getSigners();
    try {
        const tx = await autonomousAgent.connect(player).playGame(1).then((tx) => tx.wait());
        console.log('Game finish', tx?.hash);

        const balance = await ethers.provider.getBalance(rockPaperScissors.getAddress());
        console.log('RockPaperScissors balance:', balance.toString());

        const balance2 = await ethers.provider.getBalance(autonomousAgent.getAddress());
        console.log('AutonomousAgent balance:', balance2.toString());
    } catch (error) {
        console.error('Error playing the game:', error);
    }
});


