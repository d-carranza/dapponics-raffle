import { HardhatUserConfig } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"

import "hardhat-contract-sizer"

/** @type import('hardhat/config').HardhatUserConfig */

// const

const config: HardhatUserConfig = {
    solidity: "0.8.17",
}

export default config
