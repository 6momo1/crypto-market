import { fetchSearchResults } from "../data/search";
import { client } from "../apollo";
import { useFetchTokenDatas } from "../data/tokens/tokenData";
import { useFetchTokenPriceData } from "../data/tokens/priceData";
import { fetchTokenTransactions } from "../data/tokens/transactions"
import { useTopTokenAddresses } from "../data/tokens/topTokens";
import { fetchPoolsForToken } from "../data/tokens/poolsForToken";
import { fetchTokenChartData } from "../data/tokens/chartData";

// // get current block number
// const Web3 = require('Web3');
// var web3 = new Web3('');
// web3.eth.getBlockNumber()
// .then(num => {
//     console.log(num)
// });

enum tokenIds {
    WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    MM = "0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611",
}

// useEthPrices()
// .then(res => console.log("driver: ", res));

// fetch token transactions
async function fetchTokenTransactionTest() {
    console.log("FETCHING TOKEN TRASACTIONS");
    await fetchTokenTransactions(tokenIds.MM, client)
    .then(console.log)

}

// fetch token data
async function fetchTokenDatasTest() {
    console.log("FETCHING TOKEN DATA");
    await useFetchTokenDatas([tokenIds.WETH, tokenIds.WBTC], client)
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

    const res = await fetchSearchResults("ETH", client)
    console.log(res.tokenRes.asSymbol[0]);
    
    const res2 = await fetchSearchResults("WBTC", client)
    console.log(res2.tokenRes.asSymbol.slice(0,4));
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
fetchTokenDatasTest()
// addressPriceDataTest()
// searchTokenTest()
// useTopTokenAddressesTest()
// fetchPoolsForTokenTest()
// fetchTokenChartDataTest()