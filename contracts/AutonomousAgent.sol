// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RockPaperScissors.sol";

contract AutonomousAgent {
    RockPaperScissors public gameContract;

    constructor(address payable _gameContract) {
        gameContract = RockPaperScissors(_gameContract);
    }

    function playGame(uint8 choice, uint256 joinFee) external {
        gameContract.play{value: joinFee}(choice);
    }

    // Function to receive ETH
    receive() external payable {}
}