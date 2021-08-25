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
exports.useFetchTokenPriceData = exports.fetchTokenPriceData = exports.PRICES_BY_BLOCK = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const intervals_1 = require("../../constants/intervals");
// format dayjs with the libraries that we need
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
const PRICES_BY_BLOCK = (tokenAddress, blocks) => {
    let queryString = 'query blocks {';
    queryString += blocks.map((block) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }, subgraphError: allow) { 
        derivedETH
      }
    `);
    queryString += ',';
    queryString += blocks.map((block) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }, subgraphError: allow) { 
        ethPriceUSD
      }
    `);
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.PRICES_BY_BLOCK = PRICES_BY_BLOCK;
const PRICE_CHART = graphql_tag_1.default `
  query tokenHourDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
    tokenHourDatas(
      first: 100
      skip: $skip
      where: { token: $address, periodStartUnix_gt: $startTime }
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      high
      low
      open
      close
    }
  }
`;
function fetchTokenPriceData(address, interval, startTimestamp, dataClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // start and end bounds
        try {
            const endTimestamp = dayjs_1.default.utc().unix();
            if (!startTimestamp) {
                console.log('Error constructing price start timestamp');
                return {
                    data: [],
                    error: false,
                };
            }
            // create an array of hour start times until we reach current hour
            const timestamps = [];
            let time = startTimestamp;
            while (time <= endTimestamp) {
                timestamps.push(time);
                time += interval;
            }
            // backout if invalid timestamp format
            if (timestamps.length === 0) {
                return {
                    data: [],
                    error: false,
                };
            }
            let data = [];
            let skip = 0;
            let allFound = false;
            let error = false;
            while (!allFound) {
                const { data: priceData, errors, loading } = yield dataClient.query({
                    query: PRICE_CHART,
                    variables: {
                        address: address,
                        startTime: startTimestamp,
                        skip,
                    },
                    fetchPolicy: 'no-cache',
                });
                if (!loading) {
                    skip += 100;
                    if ((priceData && priceData.tokenHourDatas.length < 100) || errors) {
                        allFound = true;
                    }
                    if (priceData) {
                        data = data.concat(priceData.tokenHourDatas);
                    }
                }
                if (errors) {
                    error = true;
                }
            }
            const formattedHistory = data.map((d) => {
                return {
                    time: d.periodStartUnix,
                    open: parseFloat(d.open),
                    close: parseFloat(d.close),
                    high: parseFloat(d.high),
                    low: parseFloat(d.low),
                };
            });
            return {
                data: formattedHistory,
                error
            };
        }
        catch (e) {
            console.log(e);
            return {
                data: [],
                error: true,
            };
        }
    });
}
exports.fetchTokenPriceData = fetchTokenPriceData;
// fetch token price data
function useFetchTokenPriceData(address, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeWindow = intervals_1.TimeWindow.WEEK;
        const utcCurrentTime = dayjs_1.default();
        const startTimestamp = utcCurrentTime.subtract(1, timeWindow).startOf('hour').unix();
        const { data, error } = yield fetchTokenPriceData(address, intervals_1.ONE_HOUR_SECONDS, startTimestamp, client);
        return { data, error };
    });
}
exports.useFetchTokenPriceData = useFetchTokenPriceData;
