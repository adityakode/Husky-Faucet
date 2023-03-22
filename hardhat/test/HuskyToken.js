const {expect} = require("chai");
const hre = require("hardhat");

describe("Husky Contract", function(){
    //global vars
    let token;
    let huskyToken;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 100000000;
    let tokenBlockReward = 50;


    beforeEach(async function (){
        //get the contractFactory and signer here

        Token = await ethers.getContractFactory("HuskyToken");
        [owner,addr1,addr2] = await hre.ethers.getSigners();


        huskyToken = await Token.deploy(tokenCap,tokenBlockReward);
    });

    describe("Deployment", function(){
        it("should set the right owner",async function(){
            expect(await huskyToken.owner()).to.equal(owner.address)
        })

        it("should assign the total supply of tokens to owner",async function(){
            const ownerBalance  = await huskyToken.balanceOf(owner.address);
            expect(await huskyToken.totalSupply()).to.equal(ownerBalance)
        })

        it("should set the max  capped supply to the argument provided during deployment",async function(){
            const cap = await huskyToken.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap)
        })

        it("should set the block reward to the argument provided during deployment", async function(){
            const blockReward = await huskyToken.blockReward();
            expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
        })
    })

    describe("Transactions", function(){
        it("should transfer tokens between accounts", async function(){
            //transfer 50 tokens from owner to addr1
            await huskyToken.transfer(addr1.address,50);
            const addr1Balance = await huskyToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            //transfer 50 tokens from address 1 to address2 
            // we use .connect(signer) to send a transaction from  another account
            await huskyToken.connect(addr1).transfer(addr2.address,50);
            const addr2Balance = await huskyToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        })

        it("should fail if sender doesnt have enough tokens",async function(){
            const initialOwnerBalance = await huskyToken.balanceOf(owner.address);
            await expect(
                huskyToken.connect(addr1).transfer(owner.address,1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            //also owner balance should not have changed.

            expect(await huskyToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balance after transfers",async function(){
            const initialOwnerBalance = await huskyToken.balanceOf(owner.address);

            //transfer 100 tokens from owner to addr1
            await huskyToken.transfer(addr1.address,100);

            //transfer another 50 tokens from owner to address 1
            await huskyToken.transfer(addr2.address,50);

            //check balances

            const finalOwnerBalance = await huskyToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance = await huskyToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
            
            const addr2Balance = await huskyToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50)
        })


    })




})