import { fetchSearchResults } from "./data/search";
import { client } from "./apollo";
import { fetchEthPrices, useEthPrices } from './hooks/useETHPrices'
import { useFetchedTokenDatas } from "./data/tokens/tokenData";
import { fetchTokenPriceData } from "./data/tokens/priceData";
import dayjs from 'dayjs'
import { ONE_HOUR_SECONDS, TimeWindow } from './constants/intervals'


// // get current block number
// const Web3 = require('Web3');
// var web3 = new Web3('https://mainnet.infura.io/v3/9858506045b5436a83baed0be0a00714');
// web3.eth.getBlockNumber()
// .then(num => {
//     console.log(num)
// });


// useEthPrices()
// .then(res => console.log("driver: ", res));

// fetch token data
// useFetchedTokenDatas(["0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611"])
// .then( res => {
//     console.log(res);
// })

// fetch token price data
const timeWindow = TimeWindow.WEEK
const utcCurrentTime = dayjs()
const startTimestamp = utcCurrentTime.subtract(1, timeWindow).startOf('hour').unix()
fetchTokenPriceData(
    "0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611",
    ONE_HOUR_SECONDS, 
    startTimestamp, 
    client,
)
.then((res) => {
    console.log(res.data.length);
})



// search for Token
// fetchSearchResults("MM")
// .then( res => {
//     console.log("as name: " , res.tokenRes.asName[0]);
//     console.log("as address: ", res.tokenRes.asAddress[0]);
//     console.log("as symbol: ",res.tokenRes.asSymbol[0]);
//   }
// )
// .catch( error => {
//   console.log(error);
// })


