import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_token = require('./getContract.ts');

config();

async function mint() {
    const contract = await getContract_token();

    try {
        const privateKeys = [
            process.env.PRIVATE_KEY_1 ?? "",
            process.env.PRIVATE_KEY_2 ?? "",
        ].filter(Boolean);

        const signers = privateKeys.map(key => new ethers.Wallet(key, ethers.getDefaultProvider("sepolia")));

        const signer1 = signers[0];
        const signer1Address = await signer1.getAddress();

        const amountToMint = ethers.parseUnits("10", 18);
        console.log(`Minting ${amountToMint.toString()} tokens to ${signer1Address}...`);

        const tx = await contract.mint(signer1Address, amountToMint);

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });