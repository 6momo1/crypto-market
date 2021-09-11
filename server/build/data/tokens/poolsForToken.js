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
exports.fetchPoolsForToken = exports.POOLS_FOR_TOKEN = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.POOLS_FOR_TOKEN = graphql_tag_1.default `
  query topPools($address: Bytes!) {
    asToken0: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      id
    }
    asToken1: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token1: $address }
      subgraphError: allow
    ) {
      id
    }
  }
`;
/**
 * Fetch top addresses by volume
 */
function fetchPoolsForToken(address, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loading, errors, data } = yield client.query({
                query: exports.POOLS_FOR_TOKEN,
                variables: {
                    address: address,
                },
                fetchPolicy: 'cache-first',
            });
            if (loading || errors || !data) {
                return {
                    loading,
                    error: Boolean(errors),
                    addresses: undefined,
                };
            }
            const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id);
            return {
                loading,
                error: Boolean(errors),
                addresses: formattedData,
            };
        }
        catch (_a) {
            return {
                loading: false,
                error: true,
                addresses: undefined,
            };
        }
    });
}
exports.fetchPoolsForToken = fetchPoolsForToken;
