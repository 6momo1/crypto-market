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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPriceAlertToAllUsers = void 0;
const clients_json = __importStar(require("../../mock_database/users.json"));
const tokenAlerts_json = __importStar(require("../../mock_database/tokenAlerts.json"));
const tokenAlerts = tokenAlerts_json.tokenAlerts;
const clients = clients_json.clients;
/*
    alert user if token price is either above or below the user's price target
*/
function shouldAlertUser(subscriber, tokenSymbol, currentPrice) {
    const pricesAbove = clients[subscriber].tokenWatchlist[tokenSymbol].priceAlert.above;
    const pricesBelow = clients[subscriber].tokenWatchlist[tokenSymbol].priceAlert.below;
    // console.log(pricesAbove, pricesBelow);
    if (!pricesAbove && !pricesBelow) {
        return {
            shouldAlert: false,
            error: true,
            message: "Token is not in " + subscriber + "'s watchlist."
        };
    }
    // if current price reaches above user's price target, alert
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
    // if current price reaches below user's price target, alert
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
function notifyByEmail(subscriber, email, tokenSymbol, price) {
    console.log(`NOTIFIYING: ${subscriber} 
        by Email: ${email} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}
function notifyByTelegram(subscriber, username, tokenSymbol, price) {
    console.log(`NOTIFIYING: ${subscriber} 
        by telegram username: ${username} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}
function sendPriceAlertToAllUsers(price, tokenSymbol, tokenData) {
    const alertsSentTo = [];
    const alertsNotSentTo = [];
    // check if token exists
    if (!tokenAlerts[tokenSymbol]) {
        return {
            error: true,
            alertsSentTo,
            alertsNotSentTo,
            message: "Token does not exists in tokenAlerts Database."
        };
    }
    // get token subscribers
    const subscribers = tokenAlerts[tokenSymbol].subscribers;
    if (!subscribers) {
        return {
            error: true,
            alertsSentTo,
            alertsNotSentTo,
            message: "There are no subscribers for the token: " + tokenSymbol + "."
        };
    }
    subscribers.forEach(subscriber => {
        const { shouldAlert, error, message } = shouldAlertUser(subscriber, tokenSymbol, price);
        if (shouldAlert) {
            const clientEmail = clients[subscriber].notificationServices.email;
            const clientTelegram = clients[subscriber].notificationServices.telegram;
            console.log(clientEmail, clientTelegram);
            if (clientEmail != "") {
                notifyByEmail(subscriber, clientEmail, tokenSymbol, price);
                alertsSentTo.push({ name: subscriber, by: "email" });
            }
            if (clientTelegram != "") {
                notifyByTelegram(subscriber, clientTelegram, tokenSymbol, price);
                alertsSentTo.push({ name: subscriber, by: "telegram" });
            }
        }
        else {
            alertsNotSentTo.push(subscriber);
        }
    });
    return {
        error: false,
        alertsSentTo,
        alertsNotSentTo,
        message: "sendPriceToAllUsers() Complete."
    };
}
exports.sendPriceAlertToAllUsers = sendPriceAlertToAllUsers;
