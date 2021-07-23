

// json rpc
// crypto market watch

var Web3 = require('web3')
const UNISWAP = require('@uniswap/sdk')
console.log(`The chainId of mainnet is ${UNISWAP.ChainId.MAINNET}.`)


const url = 'https://mainnet.infura.io/v3/9858506045b5436a83baed0be0a00714' 
var web3 = new Web3(url)

const address = '0x1a201383D3CC3409f92E9c253f4Fc550D98890e9'


import { ChainId, Token } from '@uniswap/sdk'

const chainId = ChainId.MAINNET
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // must be checksummed
const decimals = 18

const DAI = new Token(chainId, tokenAddress, decimals)

import { ChainId } from '@uniswap/sdk'

const DAI = await Fetcher.fetchTokenData(chainId, tokenAddress)

async function getBalance(address) {
    var wei, balance

    // get balance
    await web3.eth.getBalance(address, (err, bal) => {
        if (err) {
            console.log(err);
            throw err;
        }
        wei = bal
    })

    // unit conversion
    try {
        balance = web3.utils.fromWei( wei, 'ether')
        console.log(balance);
        return balance
    } catch (error) {
        console.log(error);
        throw error
    }
}

// getBalance(address);

// const newAccount = web3.eth.accounts.create()
// console.log(newAccount);



