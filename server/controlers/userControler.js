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
exports.user_edit_membership = exports.user_edit_telegram = exports.user_edit_email = exports.user_remove_token_price_alert = exports.user_unsubscribe_to_token = exports.user_delete = exports.user_subscribe_to_new_token = exports.user_create = void 0;
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
                    tokenAlertsRes[0].save();
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
    yield update_user_token_watchlist(req, res);
    yield add_user_to_token_subscribers(req, res);
});
exports.user_subscribe_to_new_token = user_subscribe_to_new_token;
// endpoint for deleting user by id
const user_delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    // remove user from all token alerts subscribers list
    tokenAlerts_1.TokenAlerts.find({})
        .then(tokenInfos => {
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
            return res.send(404);
        }
        console.log("user id of: " + _id + " has been deleted.");
    }
    catch (e) {
        console.log(e);
        return res.send(400);
    }
});
exports.user_delete = user_delete;
// allow user to unsubscribe to token
const user_unsubscribe_to_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const tokenAddress = req.query.tokenAddress;
    // // remove user from all token alerts subscribers list
    const tokenAlert = yield tokenAlerts_1.TokenAlerts.findOne({ tokenAddress: tokenAddress });
    try {
        if (!tokenAlert) {
            console.log("could not find token alert object");
            return res.send(404);
        }
        console.log(tokenAlert);
        const idx = tokenAlert.subscribers.indexOf(_id);
        if (idx > -1) {
            tokenAlert.subscribers.splice(idx, 1);
            tokenAlert.save();
        }
        console.log("User removed from token subscribers list");
        res.send(200);
    }
    catch (e) {
        console.log(e);
        console.log("failed to remove user from token subscribers list");
        return res.send(400);
    }
    // remove token from users token watchlist
    const user = yield users_1.User.findById(_id);
    try {
        if (!user) {
            console.log("user not found");
            return res.send(404);
        }
        // tried to use filter but why does it not work?
        let tokenInfoIdx = -1;
        for (let i = 0; i < user.tokenWatchlist.length; i++) {
            const tokenInfo = user.tokenWatchlist[i];
            if (tokenInfo.tokenAddress == tokenAddress) {
                tokenInfoIdx = i;
            }
        }
        user.tokenWatchlist.splice(tokenInfoIdx, 1);
        user.save();
        console.log("token removed from users token watchlist");
    }
    catch (e) {
        console.log(e);
        return res.send(400);
    }
});
exports.user_unsubscribe_to_token = user_unsubscribe_to_token;
// allow user to remove token price alerts
const user_remove_token_price_alert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const above = req.query.above;
    const below = req.query.below;
    const price = req.query.price;
    const tokenAddress = req.query.tokenAddress;
    if (!above && !below) {
        res.json({ "message": "no price limit or floor received" });
        res.send(400);
    }
    const user = yield users_1.User.findById(_id);
    try {
        if (!user) {
            console.log("user not found");
            return res.send(404);
        }
        // tried to use filter but why does it not work?
        let tokenInfoIdx = -1;
        for (let i = 0; i < user.tokenWatchlist.length; i++) {
            const tokenInfo = user.tokenWatchlist[i];
            if (tokenInfo.tokenAddress == tokenAddress) {
                tokenInfoIdx = i;
            }
        }
        const userPriceAlerts = user.tokenWatchlist[tokenInfoIdx].priceAlerts;
        if (tokenInfoIdx > -1) {
            if (above) {
                const priceIndex = userPriceAlerts.above.indexOf(price);
                if (priceIndex > -1) {
                    userPriceAlerts.above.splice(priceIndex, 1);
                    user.save();
                    console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
                }
            }
            if (below) {
                const priceIndex = userPriceAlerts.below.indexOf(price);
                if (priceIndex > -1) {
                    userPriceAlerts.below.splice(priceIndex, 1);
                    user.save();
                    console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
                }
            }
        }
        else {
            console.log(`User does not have a price alert of ${price} for the token.`);
            res.send(400);
        }
    }
    catch (e) {
        console.log(e);
        res.send(400);
    }
});
exports.user_remove_token_price_alert = user_remove_token_price_alert;
const user_edit_email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const email = req.query.email;
    if (!email) {
        res.json({ "error": "No email received" });
        res.send(400);
    }
    const user = yield users_1.User.findById(_id);
    try {
        user.email = email;
        user.save();
        console.log(`email changed to ${email} for user id: ${_id}`);
        res.send(200);
    }
    catch (e) {
        console.log(e);
        res.send(400);
    }
});
exports.user_edit_email = user_edit_email;
const user_edit_telegram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const telegram = req.query.telegram;
    if (!telegram) {
        res.json({ "error": "No telegram username received" });
        res.send(400);
    }
    const user = yield users_1.User.findById(_id);
    try {
        user.telegram = telegram;
        user.save();
        console.log(`telegram username changed to ${telegram} for user id: ${_id}`);
        res.send(200);
    }
    catch (e) {
        console.log(e);
        res.send(400);
    }
});
exports.user_edit_telegram = user_edit_telegram;
const user_edit_membership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const member = req.query.member;
    if (!member) {
        res.json({ "error": "no member" });
        res.send(400);
    }
    const user = yield users_1.User.findById(_id);
    try {
        if (member == "true") {
            user.member = true;
            user.save();
            console.log(`User with id of ${_id} changed to membership to ${member}`);
            res.send(200);
        }
        if (member == "false") {
            user.member = false;
            user.save();
            console.log(`User with id of ${_id} changed to membership to ${member}`);
            res.send(200);
        }
    }
    catch (e) {
        console.log(e);
        res.send(400);
    }
});
exports.user_edit_membership = user_edit_membership;
