import { loadFixture, ethers, expect } from "./setup";

describe("Token", function() {
    async function deploy() {
        const [acc1, acc2] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("Token");
        const token = await Factory.deploy("srbrkv_test_token", "STT");
        await token.waitForDeployment();
        
        return { acc1, acc2, token }
    }

    describe("Requirements", function (){

        it("Should revert if transfer to invalid address", async function () {
            const { token } = await loadFixture(deploy);
    
            const AddressZero = "0x0000000000000000000000000000000000000000";
    
            await expect(token.transfer(AddressZero, 100)).to.be.revertedWith("Invalid to address.");
        });
    
        it("Should revert if transfer with invalid value", async function () {
            const { acc1, acc2, token } = await loadFixture(deploy);
    
            await expect(token.connect(acc1).transfer(acc2.address, 60)).to.be.revertedWith("Insufficient funds.");
        });

        it("Should revert if transferFrom to invalid address", async function () {
            const { acc1, token } = await loadFixture(deploy);
    
            const AddressZero = "0x0000000000000000000000000000000000000000";
    
            await expect(token.transferFrom(AddressZero, acc1.address, 100)).to.be.revertedWith("Invalid from address.");
            await expect(token.transferFrom(acc1.address, AddressZero, 100)).to.be.revertedWith("Invalid to address.");
        });
    
        it("Should revert if transferFrom with invalid value", async function () {
            const { acc1, acc2, token } = await loadFixture(deploy);
    
            await token.mint(acc1.address, 50);
            await token.connect(acc1).approve(acc2.address, 70);
    
            await expect(token.connect(acc2).transferFrom(acc1.address, acc2.address, 100)).to.be.revertedWith("Value can not exceed allowance");
            await expect(token.connect(acc2).transferFrom(acc1.address, acc2.address, 60)).to.be.revertedWith("Insufficient funds.");
        });
    
        it("Should revert if approve to invalid address", async function () {
            const { acc1, token } = await loadFixture(deploy);
    
            const AddressZero = "0x0000000000000000000000000000000000000000";
    
            await expect(token.approve(AddressZero, 100)).to.be.revertedWith("Invalid spender address.");
        });

        it("Should allow to mint and burn only to owner", async function () {
            const { acc1, acc2, token } = await loadFixture(deploy);
    
            await expect(token.connect(acc2).mint(acc2.address, 100)).to.be.revertedWith("You are not an owner.");
            await expect(token.connect(acc2).burn(acc2.address, 30)).to.be.revertedWith("You are not an owner.");
        });

        it("Should revert if burning from and minting on invalid address", async function () {
            const { acc1, acc2, token } = await loadFixture(deploy);
    
            const AddressZero = "0x0000000000000000000000000000000000000000";
    
            await expect(token.burn(AddressZero, 100)).to.be.revertedWith("Invalid account address.");
            await expect(token.mint(AddressZero, 100)).to.be.revertedWith("Invalid account address.");
        });
    
        it("Should revert if burning more tokens than available", async function () {
            const { acc1, token } = await loadFixture(deploy);
    
            await expect(token.burn(acc1.address, 100)).to.be.revertedWith("Insufficient funds to burn.");
        });
    });

    it("Should be deployed", async function() {
        const { token } = await loadFixture(deploy);

        expect(token.target).to.be.properAddress;
    });

    it("Should set correct name and symbol", async function() {
        const { token } = await loadFixture(deploy);
        const name = await token.name();
        const symbol = await token.symbol();

        expect(name).to.equal("srbrkv_test_token");
        expect(symbol).to.equal("STT");
    });

    it("Should allow owner to mint", async function () {
        const { acc1, acc2, token } = await loadFixture(deploy);
        
        await token.connect(acc1).mint(acc1.address, 100);
        
        const _totalSupply = await token.totalSupply();
        const _minterBalance = await token.balanceOf(acc1.address);

        expect(_totalSupply).to.equal(100);
        expect(_minterBalance).to.equal(100);
    });

    it("Should allow to transfer", async function () {
        const { acc1, acc2, token } = await loadFixture(deploy);

        await token.connect(acc1).mint(acc1.address, 100);

        await token.connect(acc1).transfer(acc2.address, 30);
        
        const acc1Balance = await token.balanceOf(acc1.address);
        const acc2Balance = await token.balanceOf(acc2.address);

        expect(acc1Balance).to.equal(70);
        expect(acc2Balance).to.equal(30);
    });

    it("Should allow to approve", async function () {
        const { acc1, acc2, token } = await loadFixture(deploy);

        await token.connect(acc1).mint(acc1.address, 100);

        await token.connect(acc1).approve(acc2.address, 30);
        const acc2Allowance = await token.allowance(acc1.address, acc2.address);

        expect(acc2Allowance).to.equal(30);
    });

    it("Should allow to transferFrom", async function () {
        const { acc1, acc2, token } = await loadFixture(deploy);

        await token.connect(acc1).mint(acc1.address, 100);

        await token.connect(acc1).approve(acc2.address, 30);
        
        await token.connect(acc2).transferFrom(acc1.address, acc2.address, 15);

        const acc1Balance = await token.balanceOf(acc1.address);
        const acc2Balance = await token.balanceOf(acc2.address);
        const acc2Allowance = await token.allowance(acc1.address, acc2.address);

        expect(acc1Balance).to.equal(85);
        expect(acc2Balance).to.equal(15);
        expect(acc2Allowance).to.equal(15);
    });

    it("Should allow to burn", async function () {
        const { acc1, token } = await loadFixture(deploy);

        await token.connect(acc1).mint(acc1.address, 100);

        await token.burn(acc1.address, 30);

        const acc1Balance = await token.balanceOf(acc1.address);
        const totalSupply = await token.totalSupply();

        expect(acc1Balance).to.equal(70);
        expect(totalSupply).to.equal(70);
    });

    it("Should return correct decimals", async function () {
        const { acc1, acc2, token } = await loadFixture(deploy);
        
        const decimals = await token.decimals();

        expect(decimals).to.equal(18);
    });
});