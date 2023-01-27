import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Raffle } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber } from "ethers"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          // Global variables
          let accounts: SignerWithAddress[]
          let deployer: SignerWithAddress
          let raffle: Raffle
          let raffleEntranceFee: BigNumber

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              raffle = await ethers.getContract("Raffle", deployer.address) // This function object comes with a provider
              raffleEntranceFee = await raffle.getEntranceFee()
          })
          describe("fulfillRandomWords", () => {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a rendom winner", async () => {
                  // Enter the raffle
                  const startingTimeStamp = await raffle.getLatestTimestamp()

                  // setup listener before we enter the raffle, just in case the blockchain moves really fast
                  await new Promise<void>(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")

                          try {
                              // Add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              console.log(`getRecentWinner returns: ${recentWinner}`)

                              const raffleState = await raffle.getRaffleState()
                              console.log(`getRaffleState returns: ${raffleState}`)

                              const winnerEndingBalance = await deployer.getBalance()
                              console.log(`ending balance: ${winnerEndingBalance.toString()}`)

                              const endingTimeStamp = await raffle.getLatestTimestamp()
                              console.log(`endingTimestamp is: ${endingTimeStamp}`)

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner, deployer.address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)

                              resolve()
                          } catch (e: unknown) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      //   Then entering the raffle
                      const transactionResponse = await raffle.enterRaffle({
                          value: raffleEntranceFee,
                      })
                      //   Wait one confirmation to get a nice snapshot of the starting balance
                      const transactionReceipt = await transactionResponse.wait(1)
                      const winnerStartingBalance = await deployer.getBalance()
                      console.log(
                          `initial balance AFTER entering the raffle: ${winnerStartingBalance.toString()}`
                      )

                      //   and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
