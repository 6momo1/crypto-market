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
exports.useFetchedTokenDatas = exports.TOKENS_BULK = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const apollo_1 = require("../../apollo");
const TOKENS_BULK = (block, tokens) => {
    let tokenString = `[`;
    tokens.map((address) => {
        return (tokenString += `"${address}",`);
    });
    tokenString += ']';
    const queryString = `
    query tokens {
      tokens(where: {id_in: ${tokenString}},` +
        (block ? `block: {number: ${block}} ,` : ``) +
        ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
        id
        symbol
        name
        derivedETH
        volumeUSD
        volume
        txCount
        totalValueLocked
        feesUSD
        totalValueLockedUSD
      }
    }
    `;
    return graphql_tag_1.default(queryString);
};
exports.TOKENS_BULK = TOKENS_BULK;
/**
 * Fetch top addresses by volume
 */
function useFetchedTokenDatas(tokenAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        yield apollo_1.client.query({ query: exports.TOKENS_BULK(undefined, tokenAddresses) })
            .then((res) => {
            data = res.data;
        });
        const parsed = (data === null || data === void 0 ? void 0 : data.tokens)
            ? data.tokens.reduce((accum, poolData) => {
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        return {
            data: parsed
        };
    });
}
exports.useFetchedTokenDatas = useFetchedTokenDatas;
