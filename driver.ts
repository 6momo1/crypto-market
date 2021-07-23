import Web3 from 'web3'
import { ChainId, Token, WETH, Fetcher } from '@uniswap/sdk'
import { getBalance, getTokenData, getPairData } from './utils'
import * as keys from './keys.json'



// variables
const url = keys.ethURL
var web3 = new Web3(url)

const address = keys.myAddress


console.log(`The chainId of mainnet is ${ChainId.MAINNET}.`)



const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const mmAddress = '0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611'



const DAI = new Token(
  ChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)


const daiData = getTokenData(daiAddress)
const mmData =  getTokenData(mmAddress)
console.log("dai Data:", daiData);
console.log("mm Data:", mmData);