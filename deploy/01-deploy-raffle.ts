import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import verify from "../utils/verify"

const VRF_SUB_FUND_AMOUNT: string = "2000000000000000000000"

const deployRaffle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number = network.config.chainId!

    let vrfCoordinatorV2Address: string
    let subscriptionId: string

    if (chainId == 31337) {
        // Mock
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        // Create VRFV2 subscription
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        // Modular chain agnostic vrfCoordinatorV2
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2!
        subscriptionId = networkConfig[chainId].subscriptionId!
    }
    log("-------------------------------------------------------")
    log("Deploying Raffle and waiting for confirmations...")

    const raffleEntranceFee = networkConfig[chainId].raffleEntranceFee
    const gasLane = networkConfig[chainId].gasLane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const keepersUpdateInterval = networkConfig[chainId].keepersUpdateInterval

    const args: any[] = [
        vrfCoordinatorV2Address,
        raffleEntranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        keepersUpdateInterval,
    ]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        // waitConfirmations: networkConfig[chainId].blockConfirmations || 5,
    })
    log(`Raffle deployed at ${raffle.address}`)

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")

        await verify(raffle.address, args)
    }
    log("----------------------------------------------------")
}

export default deployRaffle

deployRaffle.tags = ["all", "raffle"]
