import Web3 from 'web3'
import { ChainId, Token, WETH, Fetcher } from '@uniswap/sdk'
import { getBalance, getTokenData, getPairData } from './utils'
import * as keys from './keys.json'
import { fetchGraphqlData } from './fetchData'


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

let daiData
// getTokenData(daiAddress)
//   .then( res => {
//     daiData = res
//     console.log("dai token data: ",res);
// })

// getTokenData(mmAddress)
//   .then( res => {
//     daiData = res
//     console.log("mm token data: ",res);
// })


// getPairData(daiAddress)
//   .then( res => {
//     daiData = res
//     console.log("DAI pair data",res);
// })



const daiEthPair = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"

fetchGraphqlData(daiEthPair, 10)
    .then( res => {
        console.log(res);
    })
    .catch( error => {
        console.log(error);
        
    })