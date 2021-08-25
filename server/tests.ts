import { fetchSearchResults } from "./data/search";
import { client } from "./apollo";
import { useFetchedTokenDatas } from "./data/tokens/tokenData";
import { useFetchTokenPriceData } from "./data/tokens/priceData";
import { fetchTokenTransactions } from "./data/tokens/transactions"
import { useTopTokenAddresses } from "./data/tokens/topTokens";
import { fetchPoolsForToken } from "./data/tokens/poolsForToken";
import { fetchTokenChartData } from "./data/tokens/chartData";

// // get current block number
// const Web3 = require('Web3');
// var web3 = new Web3('https://mainnet.infura.io/v3/9858506045b5436a83baed0be0a00714');
// web3.eth.getBlockNumber()
// .then(num => {
//     console.log(num)
// });


// useEthPrices()
// .then(res => console.log("driver: ", res));

// fetch token transactions
async function fetchTokenTransactionTest() {
    console.log("FETCHING TOKEN TRASACTIONS");
    await fetchTokenTransactions("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", client)
    .then(console.log)

}

// fetch token data
async function fetchTokenDatasTest() {
    console.log("FETCHING TOKEN DATA");
    await useFetchedTokenDatas(["0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611"], client)
    .then(console.log)
    .catch( error => {
        console.log(error);
    })
}

// get address price data
async function addressPriceDataTest() {
    await useFetchTokenPriceData("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", client)
    .then(console.log)
    .catch( error => {
        console.log(error);
    })
}

// search for Token by symbol
async function searchTokenTest() {
    console.log("SEARCHING FOR TOKEN SYMBOL")
    await fetchSearchResults("MM", client)
    .then(console.log)
    .catch( error => {
    console.log(error);
    })
}


async function useTopTokenAddressesTest() {
    console.log("FETCHING TOP TOKEN ADDRESSES");
    await useTopTokenAddresses(client)
    .then(console.log)
    
}

async function fetchPoolsForTokenTest() {
    fetchPoolsForToken("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", client)
    .then(console.log)
}

async function fetchTokenChartDataTest() {
    fetchTokenChartData("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", client)
    .then(console.log)
}

// fetchTokenTransactionTest()
// fetchTokenDatasTest()
addressPriceDataTest()
// searchTokenTest()
// useTopTokenAddressesTest()
// fetchPoolsForTokenTest()
// fetchTokenChartDataTest()