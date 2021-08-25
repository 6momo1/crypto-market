"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_1 = require("./apollo");
const priceData_1 = require("./data/tokens/priceData");
const dayjs_1 = __importDefault(require("dayjs"));
const intervals_1 = require("./constants/intervals");
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
const timeWindow = intervals_1.TimeWindow.WEEK;
const utcCurrentTime = dayjs_1.default();
const startTimestamp = utcCurrentTime.subtract(1, timeWindow).startOf('hour').unix();
priceData_1.fetchTokenPriceData("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", intervals_1.ONE_HOUR_SECONDS, startTimestamp, apollo_1.client)
    .then((res) => {
    console.log(res.data.length);
});
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
