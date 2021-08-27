"use strict";
// import * as ETHEREUM_LOGO_URL from '../assets/images/ethereum-logo.png'
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumNetworkInfo = exports.SupportedNetwork = void 0;
var SupportedNetwork;
(function (SupportedNetwork) {
    SupportedNetwork[SupportedNetwork["ETHEREUM"] = 0] = "ETHEREUM";
    SupportedNetwork[SupportedNetwork["ARBITRUM"] = 1] = "ARBITRUM";
    SupportedNetwork[SupportedNetwork["OPTIMISM"] = 2] = "OPTIMISM";
})(SupportedNetwork = exports.SupportedNetwork || (exports.SupportedNetwork = {}));
exports.EthereumNetworkInfo = {
    id: SupportedNetwork.ETHEREUM,
    name: 'Ethereum',
    bgColor: '#fc077d',
    primaryColor: '#fc077d',
    secondaryColor: '#2172E5',
    // imageURL: ETHEREUM_LOGO_URL,
};
