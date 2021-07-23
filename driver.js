"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const sdk_1 = require("@uniswap/sdk");
const utils_1 = require("./utils");
const keys = __importStar(require("./keys.json"));
// variables
const url = keys.ethURL;
var web3 = new web3_1.default(url);
const address = keys.myAddress;
console.log(`The chainId of mainnet is ${sdk_1.ChainId.MAINNET}.`);
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const mmAddress = '0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611';
const DAI = new sdk_1.Token(sdk_1.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin');
const daiData = utils_1.getTokenData(daiAddress);
const mmData = utils_1.getTokenData(mmAddress);
console.log("dai Data:", daiData);
console.log("mm Data:", mmData);
