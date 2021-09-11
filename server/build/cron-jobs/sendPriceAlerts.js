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
exports.alertTokenSubscribers = exports.detectPriceChangesForAllTokens = void 0;
const tokenData_1 = require("../data/tokens/tokenData");
const apollo_1 = require("../apollo/");
const tokenAlerts_1 = require("../models/tokenAlerts");
const tokenAlerts_2 = require("../utils/tokenAlerts/");
const detectPriceChangesForAllTokens = (currentEthPrice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTokenAlerts = yield tokenAlerts_1.TokenAlerts.find({});
        for (let i = 0; i < allTokenAlerts.length; i++) {
            const tokenAlertObj = allTokenAlerts[i];
            yield exports.alertTokenSubscribers(tokenAlertObj, currentEthPrice);
            console.log(`Price alert for token: ${tokenAlertObj.tokenSymbol} sent to all users if conditions met.`);
        }
        return { error: false };
    }
    catch (error) {
        console.log(error);
        return { error: true };
    }
});
exports.detectPriceChangesForAllTokens = detectPriceChangesForAllTokens;
const alertTokenSubscribers = (tokenAlertObj, currentEthPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const address = tokenAlertObj.tokenAddress;
    try {
        // needs to be fetched again to get new price data
        const tokenData = yield tokenData_1.fetchTokenDatas([address], apollo_1.client, currentEthPrice);
        console.log(`sending Price alert to all ${tokenAlertObj.tokenSymbol} subscribers`);
        const feedback = yield tokenAlerts_2.sendPriceAlertToAllUsers(tokenData.data[address].priceUSD, tokenData.data[address].id, tokenAlertObj);
        return { error: false };
    }
    catch (error) {
        console.log(`ERROR: Could not send alerts to ${address} subscribers`);
        console.log(error);
        return { error: true };
    }
});
exports.alertTokenSubscribers = alertTokenSubscribers;
