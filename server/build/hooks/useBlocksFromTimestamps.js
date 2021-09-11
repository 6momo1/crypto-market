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
exports.useBlocksFromTimestamps = exports.GET_BLOCKS = void 0;
const networks_1 = require("../constants/networks");
const apollo_1 = require("../apollo");
const queries_1 = require("../utils/queries");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const GET_BLOCKS = (timestamps) => {
    let queryString = 'query blocks {';
    queryString += timestamps.map((timestamp) => {
        return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
        number
      }`;
    });
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.GET_BLOCKS = GET_BLOCKS;
/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
function useBlocksFromTimestamps(timestamps, blockClientOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeNetwork = networks_1.EthereumNetworkInfo;
        let blocks;
        let error = false;
        // derive blocks based on active network
        const networkBlocks = blocks === null || blocks === void 0 ? void 0 : blocks[activeNetwork.id];
        function fetchData() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = yield queries_1.splitQuery(exports.GET_BLOCKS, apollo_1.client, [], timestamps);
                console.log("------USEBLOCKSFROMTIMESTAMP--------RESULTS", results);
                if (results) {
                    blocks = (Object.assign(Object.assign({}, (blocks !== null && blocks !== void 0 ? blocks : {})), { [activeNetwork.id]: results }));
                }
                else {
                    error = true;
                }
            });
        }
        if (!networkBlocks && !error) {
            yield fetchData();
            console.log("------USEBLOCKSFROMTIMESTAMP--------", blocks);
        }
        console.log("------USEBLOCKSFROMTIMESTAMP--------", blocks);
        const blocksFormatted = () => {
            if (blocks === null || blocks === void 0 ? void 0 : blocks[activeNetwork.id]) {
                const networkBlocks = blocks === null || blocks === void 0 ? void 0 : blocks[activeNetwork.id];
                const formatted = [];
                for (const t in networkBlocks) {
                    if (networkBlocks[t].length > 0) {
                        formatted.push({
                            timestamp: t.split('t')[1],
                            number: networkBlocks[t][0]['number'],
                        });
                    }
                }
                return formatted;
            }
        };
        return {
            blocks: blocksFormatted(),
            error,
        };
    });
}
exports.useBlocksFromTimestamps = useBlocksFromTimestamps;
