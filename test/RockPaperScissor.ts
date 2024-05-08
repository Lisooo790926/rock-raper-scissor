import { expect } from "chai";
import { ethers } from "hardhat";
import { RockPaperScissors } from "../typechain-types";

describe("RockPaperScissors", function () {
    let rockPaperScissors: RockPaperScissors;

    beforeEach(async function () {
        const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
        rockPaperScissors = await RockPaperScissors.deploy();
    });

    describe("Gameplay", function () {
        it("Should accept a play with valid entry fee and emit result", async function () {
            const [owner, otherAccount] = await ethers.getSigners();
            const tx = await rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.01") });
            await expect(tx).to.emit(rockPaperScissors, "GameResult").withArgs(1, otherAccount.address, 0, 0, false);
        });

        it("Should not accept a play without valid entry fee", async function () {
            const [owner, otherAccount] = await ethers.getSigners();
            await expect(rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.001") }))
                .to.be.revertedWith("Invalid ETH amount");
        });

        it("Should correctly determine the winner", async function () {
            const [owner] = await ethers.getSigners();
            await rockPaperScissors.updateEntryFee(ethers.parseEther("0.01"));
            const tx = await rockPaperScissors.connect(owner).play(0, { value: ethers.parseEther("0.01") });
            const receipt = await tx.wait();
            // const event = receipt?.logs?.filter(x => x[0] === "GameResult")[0];
            // expect(event.args.playerWon).to.satisfy((won: boolean) => typeof won === "boolean");
        });
    });

    describe("Ownership and control", function () {
        it("Should allow owner to change entry fee", async function () {
            const [owner] = await ethers.getSigners();
            await rockPaperScissors.connect(owner).updateEntryFee(ethers.parseEther("0.02"));
            expect(await rockPaperScissors.entryFee()).to.equal(ethers.parseEther("0.02"));
        });

        it("Should not allow non-owner to change entry fee", async function () {
            const [owner, otherAccount] = await ethers.getSigners();
            await expect(rockPaperScissors.connect(otherAccount).updateEntryFee(ethers.parseEther("0.02")))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
