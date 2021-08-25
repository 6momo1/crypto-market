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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tokenData_1 = require("./data/tokens/tokenData");
const apollo_1 = require("./apollo");
const web3_1 = __importDefault(require("web3"));
const app = express_1.default();
// Constants
const PORT = 5000;
//middleware
app.use(cors_1.default());
app.use(express_1.default.json()); //req.body, allow express to read json
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Home Page");
});
app.post("/fetchTokenDatas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.addresses);
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
        res.send(result);
    });
}));
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
