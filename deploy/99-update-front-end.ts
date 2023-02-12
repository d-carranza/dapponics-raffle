import { frontEndContractsFile, frontEndAbiFile } from "../helper-hardhat-config"
import { network, ethers } from "hardhat"
import * as fs from "fs"

const updateFrontEnd = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        updateContractAddresses()
        updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle: any = await ethers.getContract("Raffle")
    fs.writeFileSync(frontEndAbiFile, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId!.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf-8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        currentAddresses[chainId] = [raffle.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(currentAddresses))
}

export default updateFrontEnd

updateFrontEnd.tags = ["all", "frontend"]
