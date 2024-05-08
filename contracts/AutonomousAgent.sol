// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RockPaperScissors.sol";

contract AutonomousAgent {
    RockPaperScissors public gameContract;

    constructor(address payable _gameContract) {
        gameContract = RockPaperScissors(_gameContract);
    }

    function playGame(uint8 choice) external {
        gameContract.play{value: gameContract.entryFee() }(choice);
    }

    // Function to receive ETH
    receive() external payable {}
}