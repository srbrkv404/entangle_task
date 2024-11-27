import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const contractAddress = '0xdF261b337F137646d010ae933Ab729fdfFb9f4e4';
    const MyContract = await hre.artifacts.readArtifact("Token");
    const contractABI = MyContract.abi;
    const [deployer] = await ethers.getSigners();
    return await new ethers.Contract(contractAddress, contractABI, deployer);
}

module.exports = getContract;