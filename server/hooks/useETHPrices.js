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
exports.useEthPrices = exports.fetchEthPrices = exports.ETH_PRICES = void 0;
const networks_1 = require("../constants/networks");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const useBlocksFromTimestamps_1 = require("./useBlocksFromTimestamps");
const queries_1 = require("../utils/queries");
const apollo_1 = require("../apollo");
exports.ETH_PRICES = graphql_tag_1.default `
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundles(first: 1, subgraphError: allow) {
      ethPriceUSD
    }
    oneDay: bundles(first: 1, block: { number: $block24 }, subgraphError: allow) {
      ethPriceUSD
    }
    twoDay: bundles(first: 1, block: { number: $block48 }, subgraphError: allow) {
      ethPriceUSD
    }
    oneWeek: bundles(first: 1, block: { number: $blockWeek }, subgraphError: allow) {
      ethPriceUSD
    }
  }
`;
function fetchEthPrices(blocks, client) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, loading } = yield client.query({
                query: exports.ETH_PRICES,
                variables: {
                    block24: blocks[0],
                    block48: blocks[1],
                    blockWeek: (_a = blocks[2]) !== null && _a !== void 0 ? _a : 1,
                },
            });
            if (data) {
                return {
                    data: {
                        current: parseFloat((_b = data.current[0].ethPriceUSD) !== null && _b !== void 0 ? _b : 0),
                        oneDay: parseFloat((_d = (_c = data.oneDay[0]) === null || _c === void 0 ? void 0 : _c.ethPriceUSD) !== null && _d !== void 0 ? _d : 0),
                        twoDay: parseFloat((_f = (_e = data.twoDay[0]) === null || _e === void 0 ? void 0 : _e.ethPriceUSD) !== null && _f !== void 0 ? _f : 0),
                        week: parseFloat((_h = (_g = data.oneWeek[0]) === null || _g === void 0 ? void 0 : _g.ethPriceUSD) !== null && _h !== void 0 ? _h : 0),
                    },
                    error: false,
                };
            }
            else {
                return {
                    data: undefined,
                    error: true,
                };
            }
        }
        catch (e) {
            console.log(e);
            return {
                data: undefined,
                error: true,
            };
        }
    });
}
exports.fetchEthPrices = fetchEthPrices;
/**
 * returns eth prices at current, 24h, 48h, and 1w intervals
 */
function useEthPrices() {
    return __awaiter(this, void 0, void 0, function* () {
        let prices;
        let error = false;
        let blocks;
        const dataClient = apollo_1.client;
        const [t24, t48, tWeek] = queries_1.useDeltaTimestamps();
        yield useBlocksFromTimestamps_1.useBlocksFromTimestamps([t24, t48, tWeek])
            .then(({ blocks, error }) => {
            blocks = blocks;
            error = error;
        });
        console.log(" t24, t48, tWeek: ", t24, t48, tWeek);
        console.log("BLOCKS: ", blocks, error);
        // index on active network
        const indexedPrices = prices === null || prices === void 0 ? void 0 : prices[networks_1.EthereumNetworkInfo.id];
        const formattedBlocks = () => {
            if (blocks) {
                return blocks.map((b) => parseFloat(b.number));
            }
            else
                return undefined;
        };
        console.log("FORMATTEDBLOCKS: ", formattedBlocks());
        function fetch() {
            return __awaiter(this, void 0, void 0, function* () {
                let { data, error } = yield fetchEthPrices(formattedBlocks(), dataClient);
                if (error) {
                    error = true;
                }
                else if (data) {
                    prices = ({
                        [networks_1.EthereumNetworkInfo.id]: data,
                    });
                }
            });
        }
        // if (!indexedPrices && !error && formattedBlocks) {
        //     fetch()
        // }
        yield fetch();
        return prices === null || prices === void 0 ? void 0 : prices[networks_1.EthereumNetworkInfo.id];
    });
}
exports.useEthPrices = useEthPrices;
