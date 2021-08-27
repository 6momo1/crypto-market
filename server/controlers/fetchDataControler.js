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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenPriceData = exports.tokenDatas = void 0;
const apollo_1 = require("../apollo");
const tokenData_1 = require("../data/tokens/tokenData");
const web3_1 = __importDefault(require("web3"));
const priceData_1 = require("../data/tokens/priceData");
const tokenDatas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.addresses) {
        return res.send("ERROR: no address received");
    }
    // error handling for invalid arguments
    const validAdrs = [];
    const invalidAdrs = [];
    req.body.addresses.forEach(address => {
        if (web3_1.default.utils.isAddress(address)) {
            validAdrs.push(address);
        }
        else {
            invalidAdrs.push(address);
        }
    });
    // fetch token datas
    yield tokenData_1.useFetchedTokenDatas(validAdrs, apollo_1.client)
        .then(tokenDatas => {
        let result = { addresses: { valid: validAdrs, invalid: invalidAdrs }, tokenDatas };
        res.send(result)
            .catch(error => {
            res.send(error);
        });
    });
});
exports.tokenDatas = tokenDatas;
const tokenPriceData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.address) {
        return res.send("ERROR: invalid address");
    }
    const adrs = req.body.address;
    // fetch token prices
    yield priceData_1.useFetchTokenPriceData(adrs, apollo_1.client)
        .then(data => {
        res.send({ data });
    })
        .catch(error => {
        res.send(error);
    });
});
exports.tokenPriceData = tokenPriceData;
