import { expect } from "chai";
import { ethers } from "hardhat";
import { RockPaperScissors } from "../typechain-types";

describe("RockPaperScissors", function () {
    let rockPaperScissors: RockPaperScissors;

    before(async function () {
        const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
        rockPaperScissors = await RockPaperScissors.deploy();

        // deposit init fund to the contract
        const [owner] = await ethers.getSigners();
        await owner.sendTransaction({ to: rockPaperScissors, value: ethers.parseEther("0.1") })
            .then((tx) => tx.wait());
    });

    describe("Gameplay", function () {
        it("Should accept a play with valid entry fee and emit result", async function () {
            const [_, otherAccount] = await ethers.getSigners();
            const tx = await rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.001") })
            const blockTime = await getBlockTimestamp(tx.blockHash!);
            const computerPlay = blockTime % 3;
            await expect(tx).to.emit(rockPaperScissors, "GameResult")
                .withArgs(0, otherAccount.address, computerPlay, 0, gameResult(0, computerPlay));
        });

        it("Should not accept a play without valid entry fee", async function () {
            const [_, otherAccount] = await ethers.getSigners();
            const tx = rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.0001") })
            
            await expect(tx).to.be.revertedWith("Invalid ETH amount");
        });

        it("Should update entry fee and revert by invalid fee", async function () {
            const [owner, otherAccount] = await ethers.getSigners();
            await rockPaperScissors.connect(owner).updateEntryFee(ethers.parseEther("0.002"))
                .then((tx) => tx.wait());

            const tx = rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.001") })
            await expect(tx).to.be.revertedWith("Invalid ETH amount");
        });

        it("Should accept a play with new fee", async function () {
            const [_, otherAccount] = await ethers.getSigners();
            const tx = await rockPaperScissors.connect(otherAccount).play(0, { value: ethers.parseEther("0.002") })
                .then((tx) => tx.wait());
            const blockTime = await getBlockTimestamp(tx!.blockHash!);
            const computerPlay = blockTime % 3;
            await expect(tx).to.emit(rockPaperScissors, "GameResult")
                .withArgs(1, otherAccount.address, computerPlay, 0, gameResult(0, computerPlay));
        });
    });

    describe("Ownership and control", function () {
        it("Should allow owner to change entry fee", async function () {
            const [owner] = await ethers.getSigners();
            await rockPaperScissors.connect(owner).updateEntryFee(ethers.parseEther("0.003"))
                .then((tx) => tx.wait());
            
            expect(await rockPaperScissors.entryFee()).to.equal(ethers.parseEther("0.003"));
        });

        it("Should not allow non-owner to change entry fee", async function () {
            const [_, otherAccount] = await ethers.getSigners();
            
            await expect(rockPaperScissors.connect(otherAccount).updateEntryFee(ethers.parseEther("0.002")))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should allow owner to withdraw the fund", async function () {
            const provider = ethers.provider
            const [owner] = await ethers.getSigners();
            
            const before = await provider.getBalance(rockPaperScissors)
            expect(before).to.greaterThan(0);
            
            await rockPaperScissors.connect(owner).withdraw().then((tx) => tx.wait());
            const after = await provider.getBalance(rockPaperScissors)
            expect(after).to.equal(0);
        });
    });
});


async function getBlockTimestamp(blockHash: string): Promise<number> {
    const block = await ethers.provider.getBlock(blockHash);
    return block?.timestamp ?? 0;
}

function gameResult(mine: number, yours: number): number {
    if(mine === yours) return 2
    if(mine === 0 && yours === 2 || mine === 1 && yours === 0 || mine === 2 && yours === 1) return 1
    return 0
}
