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
exports.sendPriceAlertToAllUsers = void 0;
const users_1 = require("../../models/users");
const notifyByServices_1 = require("./notifyByServices");
/*
    alert user if token price is either above or below the user's price target
// */
function shouldAlertUser(tokenAddress, currentPrice, user) {
    const watchlistObjIdx = user.tokenWatchlist.findIndex(item => item.tokenAddress === tokenAddress);
    const pricesAbove = user.tokenWatchlist[watchlistObjIdx].priceAlerts.above;
    const pricesBelow = user.tokenWatchlist[watchlistObjIdx].priceAlerts.below;
    // if user does not have any price targets, return
    if (!pricesAbove && !pricesBelow) {
        return {
            shouldAlert: false,
            error: true,
            message: "Token is not in " + user.googleId + "'s watchlist."
        };
    }
    // // if current price reaches above user's price target, alert
    for (let i = 0; i < pricesAbove.length; i++) {
        let priceAbove = pricesAbove[i];
        if (currentPrice >= priceAbove) {
            return {
                shouldAlert: true,
                error: false,
                message: "Should alert user."
            };
        }
    }
    // // if current price reaches below user's price target, alert
    for (let i = 0; i < pricesBelow.length; i++) {
        let priceAbove = pricesBelow[i];
        if (currentPrice >= priceAbove) {
            return {
                shouldAlert: true,
                error: false,
                message: "Should alert user."
            };
        }
    }
    return {
        shouldAlert: false,
        error: true,
        message: "Price targets not reached."
    };
}
function sendPriceAlertToAllUsers(price, tokenAddress, tokenAlertObj) {
    return __awaiter(this, void 0, void 0, function* () {
        // initate return objects for feedback
        const alertsSentTo = [];
        const alertsNotSentTo = [];
        // check if token exists
        if (!tokenAlertObj) {
            return {
                error: true,
                alertsSentTo,
                alertsNotSentTo,
                message: "Token does not exists in tokenAlerts Database."
            };
        }
        // get token subscribers
        const subscribers = tokenAlertObj.subscribers;
        if (!subscribers) {
            return {
                error: true,
                alertsSentTo,
                alertsNotSentTo,
                message: "There are no subscribers for the token: " + tokenAddress + "."
            };
        }
        // // for each subscriber of a token, alert them by their desired notification
        // // service (email or telegram) if their price targets are reached.
        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            const clientInfo = yield users_1.User.findOne({ googleId: subscriber });
            const { shouldAlert, error, message } = shouldAlertUser(tokenAddress, price, clientInfo);
            if (shouldAlert) {
                if (clientInfo.notifyBy.email) {
                    notifyByServices_1.notifyByEmail(clientInfo, tokenAlertObj, price);
                    alertsSentTo.push({ name: subscriber, by: "email" });
                }
                if (clientInfo.notifyBy.telegram) {
                    notifyByServices_1.notifyByTelegram(clientInfo, tokenAlertObj, price);
                    alertsSentTo.push({ name: subscriber, by: "telegram" });
                }
            }
            else {
                alertsNotSentTo.push(subscriber);
            }
        }
        return {
            error: false,
            alertsSentTo,
            alertsNotSentTo,
            message: "sendPriceToAllUsers() Complete."
        };
    });
}
exports.sendPriceAlertToAllUsers = sendPriceAlertToAllUsers;
