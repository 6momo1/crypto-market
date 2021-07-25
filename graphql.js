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
const axios_1 = __importDefault(require("axios"));
const daiEth = `{
    swaps(first: 5, where: { pair: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" } orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      id
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
}`;
const fetchGraphqlData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
            query: query
        });
        console.log(result.data.data);
    }
    catch (error) {
        console.log(error);
    }
});
console.log("Fetching...");
fetchGraphqlData(daiEth);
