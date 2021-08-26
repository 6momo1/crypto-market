"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../data/search");
const apollo_1 = require("../apollo");
const tokenData_1 = require("../data/tokens/tokenData");
const priceData_1 = require("../data/tokens/priceData");
const transactions_1 = require("../data/tokens/transactions");
const topTokens_1 = require("../data/tokens/topTokens");
const poolsForToken_1 = require("../data/tokens/poolsForToken");
const chartData_1 = require("../data/tokens/chartData");
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
function fetchTokenTransactionTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("FETCHING TOKEN TRASACTIONS");
        yield transactions_1.fetchTokenTransactions("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", apollo_1.client)
            .then(console.log);
    });
}
// fetch token data
function fetchTokenDatasTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("FETCHING TOKEN DATA");
        yield tokenData_1.useFetchedTokenDatas(["0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611"], apollo_1.client)
            .then(console.log)
            .catch(error => {
            console.log(error);
        });
    });
}
// get address price data
function addressPriceDataTest() {
    return __awaiter(this, void 0, void 0, function* () {
        yield priceData_1.useFetchTokenPriceData("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", apollo_1.client)
            .then(console.log)
            .catch(error => {
            console.log(error);
        });
    });
}
// search for Token by symbol
function searchTokenTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("SEARCHING FOR TOKEN SYMBOL");
        const res = yield search_1.fetchSearchResults("ETH", apollo_1.client);
        console.log(res.tokenRes.asSymbol[0]);
        const res2 = yield search_1.fetchSearchResults("WBTC", apollo_1.client);
        console.log(res2.tokenRes.asSymbol.slice(0, 4));
        // .then(console.log)
        // .catch( error => {
        // console.log(error);
        // })
    });
}
function useTopTokenAddressesTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("FETCHING TOP TOKEN ADDRESSES");
        yield topTokens_1.useTopTokenAddresses(apollo_1.client)
            .then(console.log);
    });
}
function fetchPoolsForTokenTest() {
    return __awaiter(this, void 0, void 0, function* () {
        poolsForToken_1.fetchPoolsForToken("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", apollo_1.client)
            .then(console.log);
    });
}
function fetchTokenChartDataTest() {
    return __awaiter(this, void 0, void 0, function* () {
        chartData_1.fetchTokenChartData("0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611", apollo_1.client)
            .then(console.log);
    });
}
// fetchTokenTransactionTest()
// fetchTokenDatasTest()
// addressPriceDataTest()
searchTokenTest();
// useTopTokenAddressesTest()
// fetchPoolsForTokenTest()
// fetchTokenChartDataTest()
