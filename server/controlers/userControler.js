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
exports.testEndpoint = exports.user_remove_token_price_alert = exports.user_unsubscribe_to_token = exports.user_delete = exports.user_subscribe_to_new_token = exports.user_create = void 0;
const users_1 = require("../models/users");
const tokenAlerts_1 = require("../models/tokenAlerts");
const tokenData_1 = require("../data/tokens/tokenData");
const apollo_1 = require("../apollo");
/*
  http request body must have:
    name,
    notifyBy:{
      email: boolean
      telegram: boolean
    },
    email
    telegram,
    member
*/
const user_create = (req, res) => {
    const newUser = new users_1.User(req.body);
    newUser.save()
        .then(result => {
        console.log("A new user created: ", newUser);
    })
        .catch(console.log);
};
exports.user_create = user_create;
// helper function to update users token watchlist
function update_user_token_watchlist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.User.findOne({ _id: req.body.userId })
            .then(user => {
            // update user token watchlist if user is already subscribed to the token
            const tokenInfoIdx = user.tokenWatchlist.findIndex(tokenInfo => tokenInfo.tokenAddress === req.body.tokenAddress);
            // if token object found in user's watchlist found
            if (tokenInfoIdx != -1) {
                if (req.body.above) {
                    user.tokenWatchlist[tokenInfoIdx].priceAlerts.above.push(req.body.watchPrice);
                }
                if (req.body.below) {
                    user.tokenWatchlist[tokenInfoIdx].priceAlerts.below.push(req.body.watchPrice);
                }
                console.log("users token watchlist updated:", user.tokenWatchlist[tokenInfoIdx]);
                user.save();
            }
            else {
                // else create a new instance of the tokenlist object to push to user watchlist array
                const newUserTokenWatchlist = {
                    tokenSymbol: req.body.tokenSymbol,
                    tokenAddress: req.body.tokenAddress,
                    priceAlerts: {
                        above: [],
                        below: [],
                    }
                };
                if (req.body.above) {
                    newUserTokenWatchlist.priceAlerts.above.push(req.body.watchPrice);
                }
                if (req.body.below) {
                    newUserTokenWatchlist.priceAlerts.below.push(req.body.watchPrice);
                }
                user.tokenWatchlist.push(newUserTokenWatchlist);
                console.log("new token added to users token watchlist: ", newUserTokenWatchlist);
                user.save();
            }
        })
            .catch(err => {
            console.log("Error: could not search given user by id");
            console.log(err);
            res.json({ "error": "Error: could not search given user by id" });
        });
    });
}
// helper function to add user to tokenAlerts subscribers list
function add_user_to_token_subscribers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // update token alerts database
        yield tokenAlerts_1.TokenAlerts.find({ tokenAddress: req.body.tokenAddress })
            .then(tokenAlertsRes => {
            // add user to token subscribers list if it already exists
            if (tokenAlertsRes.length != 0) {
                if (!tokenAlertsRes[0].subscribers.includes(req.body.userId)) {
                    tokenAlertsRes[0].subscribers.push(req.body.userId);
                    console.log("Added userId of : " + req.body.userId + " to " + tokenAlertsRes[0].tokenSymbol);
                }
                else {
                    console.log("user is already subscribed to this token.");
                }
            }
            else {
                // create a new price alert object
                tokenData_1.useFetchTokenDatas([req.body.tokenAddress], apollo_1.client)
                    .then(tokenDatas => {
                    console.log(tokenDatas);
                    // check if token data was fetched
                    if (Object.keys(tokenDatas.data).length == 0) {
                        res.json({ "error": "Invalid token address" });
                    }
                    // create new instance of token alert object to update database
                    const newTokenAlert = new tokenAlerts_1.TokenAlerts({
                        tokenSymbol: tokenDatas.data[req.body.tokenAddress].symbol,
                        tokenName: tokenDatas.data[req.body.tokenAddress].name,
                        tokenAddress: req.body.tokenAddress,
                        subscribers: []
                    });
                    newTokenAlert.subscribers.push(req.body.userId);
                    newTokenAlert.save();
                    console.log("New Token alert object created: ", newTokenAlert);
                })
                    .catch(err => {
                    console.log("Failed to create new Token alerts object");
                    console.log(err);
                });
            }
        })
            .catch(err => {
            console.log("Error searching for a tokenAlerts Object. ");
        });
    });
}
/*
  http request body must have:
    userId,
    tokneSymbol,
    tokenAddress,
    above? or below?
    watchPrice
*/
const user_subscribe_to_new_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // do not add duplicate price alerts
    update_user_token_watchlist(req, res);
    add_user_to_token_subscribers(req, res);
});
exports.user_subscribe_to_new_token = user_subscribe_to_new_token;
const user_delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    console.log(_id);
    // remove user from all token alerts subscribers list
    tokenAlerts_1.TokenAlerts.find({})
        .then(tokenInfos => {
        console.log(tokenInfos);
        for (let i = 0; i < tokenInfos.length; i++) {
            const idx = tokenInfos[i].subscribers.indexOf(_id);
            if (idx > -1) {
                tokenInfos[i].subscribers.splice(idx, 1);
                tokenInfos[i].save();
            }
        }
    });
    const user = yield users_1.User.findByIdAndDelete(_id);
    try {
        if (!user) {
            console.log("user not found and not deleted");
            return res.sendStatus(404);
        }
        console.log("user id of: " + _id + " has been deleted.");
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
});
exports.user_delete = user_delete;
const user_unsubscribe_to_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.user_unsubscribe_to_token = user_unsubscribe_to_token;
const user_remove_token_price_alert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.user_remove_token_price_alert = user_remove_token_price_alert;
const testEndpoint = (req, res) => {
    console.log(req.body);
};
exports.testEndpoint = testEndpoint;
