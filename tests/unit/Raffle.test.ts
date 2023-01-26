import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async function () {
          let deployer: SignerWithAddress
          let raffle: Raffle
          let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock

          beforeEach(async function () {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer.address) // This function object comes with a provider
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", async function () {
              it("initializes the raffle correctly", async function () {})
          })
      })
