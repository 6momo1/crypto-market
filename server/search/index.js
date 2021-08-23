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
exports.fetchSearchResults = exports.POOL_SEARCH = exports.TOKEN_SEARCH = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const apollo_1 = require("../apollo");
exports.TOKEN_SEARCH = graphql_tag_1.default `
  query tokens($value: String, $id: String) {
    asSymbol: tokens(
      where: { symbol_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asName: tokens(
      where: { name_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      symbol
      name
      totalValueLockedUSD
    }
  }
`;
exports.POOL_SEARCH = graphql_tag_1.default `
  query pools($tokens: [Bytes]!, $id: String) {
    as0: pools(where: { token0_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    as1: pools(where: { token1_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    asAddress: pools(where: { id: $id }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`;
function fetchSearchResults(value) {
    function fetch() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield apollo_1.client.query({
                    query: exports.TOKEN_SEARCH,
                    variables: {
                        value: value ? value.toUpperCase() : '',
                        id: value,
                    },
                });
                const pools = yield apollo_1.client.query({
                    query: exports.POOL_SEARCH,
                    variables: {
                        tokens: (_a = tokens.data.asSymbol) === null || _a === void 0 ? void 0 : _a.map((t) => t.id),
                        id: value,
                    },
                });
                if (tokens.data) {
                    console.log("TOKENS: ", tokens.data);
                }
                if (pools.data) {
                    console.log("POOLS: ", pools.data);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    fetch();
}
exports.fetchSearchResults = fetchSearchResults;
