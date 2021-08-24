import { fetchSearchResults } from "./data/search";
import { client } from "./apollo";
import { fetchEthPrices, useEthPrices } from './hooks/useETHPrices'
import { useFetchedTokenDatas } from "./data/tokens/tokenData";



// // get current block number
// const Web3 = require('Web3');
// var web3 = new Web3('https://mainnet.infura.io/v3/9858506045b5436a83baed0be0a00714');
// web3.eth.getBlockNumber()
// .then(num => {
//     var block = num -1
//     fetchEthPrices([block,block-1,block-2],client)
//     .then(({data, error}) => {
//         console.log(data);
//     })
// });

// useEthPrices()
// .then(res => console.log("driver: ", res));


useFetchedTokenDatas(["0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611"])

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


