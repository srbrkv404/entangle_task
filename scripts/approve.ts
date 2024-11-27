import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContractToken = require('./getContract.ts');

config();

async function approve() {
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

        const allowanceAmount = ethers.parseUnits("2", 18);

        const approve_tx = await contract.connect(signer1).approve(signer2Address, allowanceAmount);
        await approve_tx.wait();
        
        const curAllowance = await contract.allowance(signer1Address, signer2Address);
        console.log(`Allowance from ${signer1Address} to ${signer2Address}: ${curAllowance}`); 

        console.log(`Approve transaction finished.`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }
}

approve()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });