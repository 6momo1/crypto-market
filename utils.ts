
import Web3 from 'web3'
import { ChainId, Token, WETH, Fetcher, Pair} from '@uniswap/sdk'
import * as data from './keys.json';

export {
    getPairData,
    getTokenData,
    getBalance,
}


// custom type
type Dictionary = {
  [key: string]: any
}


const url = ''
var web3 = new Web3(url)


const getPairData = async (address: string): Promise<Pair> => {

    const DAI = new Token(ChainId.MAINNET, address, 18)

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
    return pair
}




const getTokenData = async (address: string): Promise<Token> => {
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const chainId = ChainId.MAINNET
    const tokenData: Token = await Fetcher.fetchTokenData(chainId, address)
    return tokenData
}


async function getBalance() {

}
// async function getBalance(address: string): Promise<string> {

//     var wei: string
//     var balance: string

//     // get balance
//     await web3.eth.getBalance(address, (err, bal) => {
//         if (err) {
//             console.log(err);
//             return "-1";
//         }
//         wei = bal
//     })

//     // unit conversion
//     try {
//         balance = web3.utils.fromWei( wei, 'ether')
//         console.log(balance);
//         return balance
//     } catch (error) {
//         console.log(error);
//         return "-1";
//     }
// }
