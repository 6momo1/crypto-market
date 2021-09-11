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
exports.useTopTokenAddresses = exports.TOP_TOKENS = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.TOP_TOKENS = graphql_tag_1.default `
  query topPools {
    tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`;
/**
 * Fetch top addresses by volume
 */
function useTopTokenAddresses(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { loading, errors, data } = yield client.query({ query: exports.TOP_TOKENS });
        const formattedData = () => {
            if (data) {
                return data.tokens.map((t) => t.id);
            }
            else {
                return undefined;
            }
        };
        return {
            loading: loading,
            error: Boolean(errors),
            addresses: formattedData(),
        };
    });
}
exports.useTopTokenAddresses = useTopTokenAddresses;
