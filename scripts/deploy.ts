const hre = require("hardhat");

async function main_() {
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy("srbrkv_test_token", "STT");
    await token.waitForDeployment();

    console.log("Token:", token.address);
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});