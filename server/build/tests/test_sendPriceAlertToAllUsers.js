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
const apollo_1 = require("../apollo");
const tokenData_1 = require("../data/tokens/tokenData");
const tokenAlerts_1 = require("../utils/tokenAlerts");
var tokenIds;
(function (tokenIds) {
    tokenIds["WETH"] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    tokenIds["WBTC"] = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    tokenIds["MM"] = "0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611";
})(tokenIds || (tokenIds = {}));
function testSendPriceAlertToAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenData = yield tokenData_1.useFetchTokenDatas([tokenIds.WETH], apollo_1.client);
            const feedback = tokenAlerts_1.sendPriceAlertToAllUsers(3000, tokenIds.WETH, tokenData[0]);
            console.log(feedback);
        }
        catch (error) {
            console.log(error);
        }
    });
}
testSendPriceAlertToAllUsers();
