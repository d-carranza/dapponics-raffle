export interface networkConfigItem {
    name?: string
    subscriptionId?: string
    gasLane?: string
    keepersUpdateInterval?: string
    raffleEntranceFee?: string
    callbackGasLimit?: string
    vrfCoordinatorV2?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        subscriptionId: "9163",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "10000000000000000", // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
        blockConfirmations: 1,
    },
    5: {
        name: "goerli",
        subscriptionId: "9163",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "10000000000000000", // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        blockConfirmations: 5,
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
    },
}

export const frontEndContractsFile =
    "../Lesson 10 NextJS Smart Contract Lottery (Full Stack  Front End)/dapponics-raffle/constants/contractAddress.json"

export const frontEndAbiFile =
    "../Lesson 10 NextJS Smart Contract Lottery (Full Stack  Front End)/dapponics-raffle/constants/abi.json"

export const developmentChains: string[] = ["hardhat", "localhost"]
