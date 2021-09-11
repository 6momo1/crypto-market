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
exports.user_edit_membership = exports.user_toggle_email = exports.user_toggle_telegram = exports.user_edit_telegram = exports.user_edit_email = exports.user_remove_token_price_alert = exports.user_unsubscribe_to_token = exports.user_delete = exports.user_subscribe_to_new_token = exports.user_create = void 0;
const users_1 = require("../models/users");
const tokenData_1 = require("../data/tokens/tokenData");
const apollo_1 = require("../apollo");
const validateEmail_1 = require("../utils/validateEmail");
const tokenAlerts_1 = require("../models/tokenAlerts");
const fetchEthPrices_1 = require("../data/tokens/fetchEthPrices");
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
    newUser
        .save()
        .then((result) => {
        console.log("A new user created: ", newUser);
    })
        .catch(console.log);
};
exports.user_create = user_create;
// helper function to update users token watchlist
function update_user_token_watchlist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleId = req.body.googleId;
        const tokenAddress = req.body.tokenAddress;
        const above = req.body.above;
        const below = req.body.below;
        const watchPrice = req.body.watchPrice;
        const tokenSymbol = req.body.tokenSymbol;
        try {
            const user = yield users_1.User.findOne({ googleId });
            if (user) {
                // update user token watchlist if user is already subscribed to the token
                const tokenInfoIdx = user.tokenWatchlist.findIndex((tokenInfo) => tokenInfo.tokenAddress === tokenAddress);
                // if token object found in user's watchlist found
                if (tokenInfoIdx != -1) {
                    if (above) {
                        user.tokenWatchlist[tokenInfoIdx].priceAlerts.above.push(watchPrice);
                    }
                    if (below) {
                        user.tokenWatchlist[tokenInfoIdx].priceAlerts.below.push(watchPrice);
                    }
                    console.log("users token watchlist updated:", user.tokenWatchlist[tokenInfoIdx]);
                    user.save();
                    return true;
                }
                else {
                    // else create a new instance of the tokenlist object to push to user watchlist array
                    const newUserTokenWatchlist = {
                        tokenSymbol: tokenSymbol,
                        tokenAddress: tokenAddress,
                        priceAlerts: {
                            above: [],
                            below: [],
                        },
                    };
                    if (above) {
                        newUserTokenWatchlist.priceAlerts.above.push(watchPrice);
                    }
                    if (below) {
                        newUserTokenWatchlist.priceAlerts.below.push(watchPrice);
                    }
                    user.tokenWatchlist.push(newUserTokenWatchlist);
                    console.log("new token added to users token watchlist: ", newUserTokenWatchlist);
                    user.save();
                    return true;
                }
            }
            else {
                console.log("ERROR: could not search given user by googleId");
                res.json({
                    error: "true",
                    message: "Error: could not search given user by id",
                });
                return false;
            }
        }
        catch (error) {
            console.log(error);
            res.json({ error: "true" });
            return false;
        }
    });
}
// helper function to add user to tokenAlerts subscribers list
function add_user_to_token_subscribers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleId = req.body.googleId;
        const tokenAddress = req.body.tokenAddress;
        // update token alerts database
        try {
            const tokenAlertObj = yield tokenAlerts_1.TokenAlerts.findOne({
                tokenAddress,
            });
            // if tokenAlert Object does not exist in database, create a new one and add user
            // to its subscribers list
            if (!tokenAlertObj) {
                try {
                    const currentEthPrice = yield fetchEthPrices_1.fetchEthPrice();
                    const newTokenData = yield tokenData_1.fetchTokenDatas([tokenAddress], apollo_1.client, currentEthPrice);
                    // check if token address and token data is valid
                    if (Object.keys(newTokenData.data).length == 0) {
                        res.json({ message: "Invalid token address", error: true });
                        return false;
                    }
                    // create new instance of token alert object to update database
                    const newTokenAlert = new tokenAlerts_1.TokenAlerts({
                        tokenSymbol: newTokenData.data[tokenAddress].symbol,
                        tokenName: newTokenData.data[tokenAddress].name,
                        tokenAddress: tokenAddress,
                        subscribers: [],
                    });
                    // add user to the token alert object
                    newTokenAlert.subscribers.push(googleId);
                    newTokenAlert.save();
                    console.log("New Token alert object created: ", newTokenAlert);
                    return true;
                }
                catch (error) {
                    console.log("Failed to create new Token alerts object");
                    res.json({ error: "true" });
                    console.log(error);
                    return false;
                }
            }
            else {
                try {
                    // check if user is already subscribed to this token
                    if (!tokenAlertObj.subscribers.includes(googleId)) {
                        // append user to existing token alert object
                        tokenAlertObj.subscribers.push(googleId);
                        tokenAlertObj.save();
                        console.log("Added googleId of : " +
                            googleId +
                            " to " +
                            tokenAlertObj.tokenSymbol);
                        return true;
                    }
                    else {
                        console.log("user is already subscribed to this token.");
                        return true;
                    }
                }
                catch (error) {
                    console.log("ERROR");
                    console.log(error);
                    res.json({ error: "true" });
                    return false;
                }
            }
        }
        catch (error) {
            console.log("ERROR");
            console.log(error);
            res.json({ error: "true" });
            return false;
        }
    });
}
/**
 * Allow user to user to subscribe to a new token
 * @param req POST {
 *  googleId: string,
 * tokenSymbol: string,
 * tokenAddress: string,
 * above: boolean,
 * below: bolean,
 * watchPrice: number
 * }
 * @param res Status code or User object
 */
const user_subscribe_to_new_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const success = yield update_user_token_watchlist(req, res);
    if (!success) {
        return;
    }
    yield add_user_to_token_subscribers(req, res);
    const user = yield users_1.User.find({ googleId: googleId });
    res.json({ user, error: false });
    console.log(req.body);
});
exports.user_subscribe_to_new_token = user_subscribe_to_new_token;
// endpoint for deleting user by id
/**
 *
 * @param req DELETE {
 *  googleId: string
 * }
 * @param res
 * @returns
 */
const user_delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.body.id;
    // remove user from all token alerts subscribers list
    tokenAlerts_1.TokenAlerts.find({}).then((tokenInfos) => {
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
/**
 *
 * @param req DELETE {
 *  googleId: string,
 *  tokenAddress: string,
 * }
 * @param res Status code or User object
 * @returns Status code or User object
 */
const user_unsubscribe_to_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.id;
    const tokenAddress = req.body.tokenAddress;
    // // remove user from all token alerts subscribers list
    const tokenAlert = yield tokenAlerts_1.TokenAlerts.findOne({ tokenAddress: tokenAddress });
    try {
        if (!tokenAlert) {
            console.log("could not find token alert object");
            return res.send(404);
        }
        console.log(tokenAlert);
        const idx = tokenAlert.subscribers.indexOf(googleId);
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
    const user = yield users_1.User.findById(googleId);
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
/*
  DELETE: {
    googleId: string,
    tokenaddress: string
    above: boolean
    below: boolean
    price: number
  }
*/
const user_remove_token_price_alert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const above = req.body.above;
    const below = req.body.below;
    const price = req.body.price;
    const tokenAddress = req.body.tokenAddress;
    if (!above && !below) {
        res.sendStatus(400).send({ error: "no price limit or floor received" });
    }
    const user = yield users_1.User.findOne({ googleId: googleId });
    try {
        if (!user) {
            console.log("user not found");
            return res.sendStatus(400).send({ error: "user not found" });
        }
        // tried to use "filter" but why does it not work?
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
                    res.json(user);
                }
            }
            if (below) {
                const priceIndex = userPriceAlerts.below.indexOf(price);
                if (priceIndex > -1) {
                    userPriceAlerts.below.splice(priceIndex, 1);
                    user.save();
                    console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
                    res.json(user);
                }
            }
        }
        else {
            console.log(`User does not have a price alert of ${price} for the token.`);
            res
                .sendStatus(400)
                .send({ error: "User does not have a price alert for requested " });
        }
    }
    catch (e) {
        console.log(e);
        res.send(400);
    }
});
exports.user_remove_token_price_alert = user_remove_token_price_alert;
// Allow user to edit their email account
/**
 *
 * @param req PUT: {
 *  googleId: string,
 *  email: string,
 * }
 * @param res error message
 */
const user_edit_email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const email = req.body.email;
    if (!email) {
        // res.send(400).send({"error":"No email received"})
        res.sendStatus(400);
        console.log({ error: "No email received" });
        return;
    }
    if (!validateEmail_1.validateEmail(email)) {
        res.sendStatus(400);
        console.log({ error: "Invalid email" });
        return;
    }
    try {
        const user = yield users_1.User.findOne({ googleId });
        user.email = email;
        user.save();
        console.log(`email changed to ${email} for user id: ${googleId}`);
        res.json(user);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});
exports.user_edit_email = user_edit_email;
// Allow user to edit their telegram account
/**
 *
 * @param req PUT: {
 *  googleId: string,
 *  telegram: string
 * }
 * @param res error message
 */
const user_edit_telegram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const telegram = req.body.telegram;
    if (!telegram) {
        console.log({ error: "No telegram username received" });
        res.sendStatus(400);
        return;
    }
    const user = yield users_1.User.findOne({ googleId });
    try {
        user.telegram = telegram;
        user.save();
        console.log(`telegram username changed to ${telegram} for user id: ${googleId}`);
        res.json(user);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
        console.log({ error: "something went wrong in the server" });
    }
});
exports.user_edit_telegram = user_edit_telegram;
// Allow user to toggle weather they want to be notfied by telegram
/**
 *
 * @param req PUT: {
 *  googleId: string,
 *  notify: boolean
 * }
 * @param res error message
 */
const user_toggle_telegram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const notify = req.body.notify;
    if (!googleId) {
        console.log("googleId received");
        res.sendStatus(400);
        return;
    }
    if (notify === undefined) {
        console.log("notify received");
        res.sendStatus(400);
        return;
    }
    const user = yield users_1.User.findOne({ googleId });
    try {
        user.notifyBy.telegram = notify;
        user.save();
        console.log(`telegram toggled to ${notify} for user id: ${googleId}`);
        res.json(user);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
        console.log(`ERROR: Failed to toggle telegram for user ${googleId}`);
    }
});
exports.user_toggle_telegram = user_toggle_telegram;
// Allow user to toggle weather they want to be notfied by email
/**
 *
 * @param req PUT: {
 *  googleId: string,
 *  notify: boolean
 * }
 * @param res error message
 */
const user_toggle_email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const notify = req.body.notify;
    if (!googleId) {
        console.log("googleId not received");
        res.sendStatus(400);
        return;
    }
    if (notify === undefined) {
        console.log("Notify not received");
        res.sendStatus(400);
        return;
    }
    const user = yield users_1.User.findOne({ googleId });
    try {
        user.notifyBy.email = notify;
        user.save();
        console.log(`email toggled to ${notify} for user id: ${googleId}`);
        res.json(user);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
        console.log(`ERROR: Failed to toggle email for user ${googleId}`);
    }
});
exports.user_toggle_email = user_toggle_email;
// Edit user membership status
/**
 *
 * @param req PUT {
 *  googleId: string,
 *  member: boolean
 * }
 * @param res Status code 400 or User object
 */
const user_edit_membership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleId = req.body.googleId;
    const member = req.body.member;
    if (!member) {
        res.json({ error: "no member status received" });
        res.send(400);
    }
    const user = yield users_1.User.findOne({ googleId });
    try {
        if (member == "true") {
            user.member = true;
            user.save();
            console.log(`User with id of ${googleId} changed to membership to ${member}`);
            res.json(user);
        }
        if (member == "false") {
            user.member = false;
            user.save();
            console.log(`User with id of ${googleId} changed to membership to ${member}`);
            res.json(user);
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400).send({ error: "something went wrong in the server" });
    }
});
exports.user_edit_membership = user_edit_membership;
