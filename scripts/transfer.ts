import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContractToken = require('./getContract.ts');

config();

async function transfer() {
    const tokenAddress = "0xdF261b337F137646d010ae933Ab729fdfFb9f4e4";
    const contract = await getContractToken(tokenAddress);

    try {
        const privateKeys = [
            process.env.PRIVATE_KEY_1 ?? "",
            process.env.PRIVATE_KEY_2 ?? "",
        ].filter(Boolean);

        const signers = privateKeys.map(key => new ethers.Wallet(key, ethers.getDefaultProvider("sepolia")));

        const signer1 = signers[0];
        const signer2 = signers[1];

        const signer1Address = await signer1.getAddress();
        const signer2Address = await signer2.getAddress();

        const amountToSend = ethers.parseUnits("2", 18);

        console.log(`Sending ${amountToSend.toString()} tokens from ${signer1Address} to ${signer2Address}...`);

        const tx = await contract.connect(signer1).transfer(signer2Address, amountToSend);

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);

        const signer1Balance = await contract.balanceOf(signer1Address);
        const signer2Balance = await contract.balanceOf(signer2Address);

        console.log(`Balance of sender:${signer1Balance}`)
        console.log(`Balance of recipient:${signer2Balance}`)
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }
}

transfer()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
