// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RockPaperScissors is Ownable {
    
    uint256 public gameId; 
    uint256 public entryFee = 0.001 ether;

    event GameResult(
        uint256 indexed gameId,
        address indexed player,
        uint8 computerChoice,
        uint8 playerChoice,
        uint8 playerWon
    );

    constructor() {
        gameId = 0;
    }

    function play(uint8 playerChoice) public payable {
        require(msg.value == entryFee, "Invalid ETH amount");
        require(playerChoice <= 2, "Invalid choice");
        require(address(this).balance >= entryFee * 2, "Insufficient contract balance to pay out a win");

        uint8 computerChoice = generateRandomChoice();
        uint8 playerWon = determineWinner(playerChoice, computerChoice);

        if (playerWon == 1) {
            payable(msg.sender).transfer(msg.value * 2);
        } else if (playerWon == 2) {
            payable(msg.sender).transfer(msg.value);
        }

        emit GameResult(gameId, msg.sender, computerChoice, playerChoice, playerWon);
        gameId++;
    }

    function generateRandomChoice() private view returns (uint8) {
        return uint8(block.timestamp % 3);
    }

    function determineWinner(uint8 playerChoice, uint8 computerChoice) private pure returns (uint8) {
        if (playerChoice == computerChoice) {
            return 2;
        }
        
        // 0: Rock, 1: Paper, 2: Scissors
        if((playerChoice == 0 && computerChoice == 2)  || 
            (playerChoice == 1 && computerChoice == 0) ||
            (playerChoice == 2 && computerChoice == 1)) {
            return 1;
        } else {
            return 0;
        }
    }

    receive() external payable {}

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function updateEntryFee(uint256 newFee) public onlyOwner {
        require(newFee > 0, "Fee must be greater than zero");
        entryFee = newFee;
    }
}
