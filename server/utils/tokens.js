"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTokenSymbol = exports.formatTokenName = exports.WETH_ADDRESS = void 0;
exports.WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
function formatTokenName(address, name) {
    if (address === exports.WETH_ADDRESS) {
        return 'Ether';
    }
    return name;
}
exports.formatTokenName = formatTokenName;
function formatTokenSymbol(address, symbol) {
    if (address === exports.WETH_ADDRESS) {
        return 'ETH';
    }
    return symbol;
}
exports.formatTokenSymbol = formatTokenSymbol;
