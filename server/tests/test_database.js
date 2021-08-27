"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenAlerts_1 = require("../utils/tokenAlerts");
var tokenIds;
(function (tokenIds) {
    tokenIds["WETH"] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    tokenIds["WBTC"] = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
})(tokenIds || (tokenIds = {}));
const data = {
    "WETH": {
        __typename: 'Token',
        derivedETH: '1',
        feesUSD: '227787427.6122418470729657019290464',
        id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        totalValueLocked: '281462.44992989742295117',
        totalValueLockedUSD: '875095497.5464238673362415986799461',
        txCount: '4061946',
        volume: '39435464.506996739941724527',
        volumeUSD: '100505156818.8780917505419969876279'
    },
    "WBTC": {
        __typename: 'Token',
        derivedETH: '15.09235154245341256138395874226145',
        feesUSD: '25240907.10218238787674128131598288',
        id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        totalValueLocked: '4526.35176568',
        totalValueLockedUSD: '212393000.6029571919049852776225647',
        txCount: '233118',
        volume: '270024.97712417',
        volumeUSD: '10369583639.79845399086361288260995'
    }
};
function sendPriceAlertToAllUsersTEST() {
    const res = tokenAlerts_1.sendPriceAlertToAllUsers(3000.00, "WETH", data.WETH);
    console.log(res);
}
sendPriceAlertToAllUsersTEST();
// const tokenAlerts = tokenAlerts_json.tokenAlerts
// const sym = "WETH"
// console.log(tokenAlerts[sym].subscribers);
