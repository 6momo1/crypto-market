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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.getTokenData = exports.getPairData = void 0;
const web3_1 = __importDefault(require("web3"));
const sdk_1 = require("@uniswap/sdk");
const url = '';
var web3 = new web3_1.default(url);
const getPairData = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const DAI = new sdk_1.Token(sdk_1.ChainId.MAINNET, address, 18);
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = yield sdk_1.Fetcher.fetchPairData(DAI, sdk_1.WETH[DAI.chainId]);
    return pair;
});
exports.getPairData = getPairData;
const getTokenData = (address) => __awaiter(void 0, void 0, void 0, function* () {
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const chainId = sdk_1.ChainId.MAINNET;
    const tokenData = yield sdk_1.Fetcher.fetchTokenData(chainId, address);
    return tokenData;
});
exports.getTokenData = getTokenData;
function getBalance() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.getBalance = getBalance;
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
