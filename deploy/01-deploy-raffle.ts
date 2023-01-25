import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployRaffle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number = network.config.chainId!

    let vrfCoordinatorV2Address

    if (chainId == 31337) {
        // Mock
        const vrfCoordinatorV2 = await deployments.get("VRFCoordinatorV2")
        vrfCoordinatorV2Address = vrfCoordinatorV2.address

        const transactionResponse = await vrfCoordinatorV2Mock.crea //Continuar aqui
    } else {
        // Modular chain agnostic vrfCoordinatorV2
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2!
    }
    log("-------------------------------------------------------")
    log("Deploying Raffle and waiting for confirmations...")

    const raffleEntranceFee = networkConfig[chainId].raffleEntranceFee
    const gasLane = networkConfig[chainId].gasLane
    const args: any[] = [vrfCoordinatorV2Address, raffleEntranceFee, gasLane, ,]
    const Raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
    })
    log(`Raffle deployed at ${Raffle.address}`)
}

export default deployRaffle

deployRaffle.tags = ["all", "Raffle"]
