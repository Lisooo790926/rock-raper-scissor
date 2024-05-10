# Rock Paper Scissor Game Contract
This project is for playing Rock Paper Scissor Game

### Contract rule
(1) validating the ETH value
(2) generating Rock-Paper-Scissors randomly 
(3) compete with user input
(4) return ETH if user wins or seize the ETH if user loses
(5) using emit to log game result with gameid (increasing num), user_address (interact address), computer_pose (rock - 0, paper -1, scissor - 2), user_pose (rock - 0, paper -1, scissor - 2)


### Local Testing
**Contract Introduction**
1. `RockPaperScissors`: Create the contract with below methods/event
   - `play`: to generate the random choice and play with the participant user
     - if user win: return twice entryFee
     - if user lose: lose entryFee
     - if tie: return entryFee
   - `generateRandomChoice`: based on the current block timestamp to randomly generate the choice
   - `determineWinner`: based on user and computer choice to decide who is winner (0: lose, 1: win, 2: tie)
   - `receive`: allow anyone to deposit to contract
   - `withdraw`: allow owner to withdraw the contract balance
   - `updateEntryFee`: allow owner update the entry fee if require
   - event `GameResult`: Show the game result
   - attribute `gameId`: global monotonic id
   - attribute `entryFee`: define the entry fee for each game
2. `AutonomousAgent`: like agent contract for easily interacting with RockPaperScissors\
   - `playGame`: interact RockPaperScissors to play game
   - `receive`: allow anyone to deposit to contract
**Commands:**
```shell
-- compile the contract
npm run compile
-- start local node and deploy contract and interact with contract
npx hardhat node
npm run deploy 
npx hardhat playGame --network local
-- test contract
npm run test
```
**Test result**\
![image](https://github.com/Lisooo790926/rock-raper-scissor/assets/48560984/1a0127e5-6b00-4ab1-a117-3a3203670318)

### Dev testing
**Commands:**
```shell
-- deploy Sepolia
npm run deploy:dev
npx hardhat playGame --network dev
```
### Contract Address:
- AAContract: https://sepolia.etherscan.io/address/0x5ee0cd2e3c49fb817573432944dbbadf745d3a9b
- RockPaperScissorsContract: https://sepolia.etherscan.io/address/0x3b4D3b01FAa992dE10061ad1f011e1DE1cBaaeF2 \

### Testing result:
- left window is the event listener
- right window is using AAContract to interact with RockPaperScissorsContract \
![image](https://github.com/Lisooo790926/rock-raper-scissor/assets/48560984/da0d75be-25fb-4805-b044-961b9871399d)


### AA Wallet
Integrate with Alchemy SDK https://accountkit.alchemy.com/packages/aa-alchemy \
Add below ts file
1. account.ts : for creating SmartContractWallet
2. deposit.ts : deposit init fund into SmartContractWallet
3. waitTxn.ts : waiting for transaction finish when sendUserOperation
Also add three tasks for AA wallet
```shell
1. npx hardhat createAccount --network dev
-- for create smartContractAccount

2. npx hardhat transfer --network dev
-- deposit init amount into above account

3. npx hardhat playGameAA --network dev
-- interact with above contract
```
Interact transaction https://sepolia.etherscan.io/address/0x3b4D3b01FAa992dE10061ad1f011e1DE1cBaaeF2


