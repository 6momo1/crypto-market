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
exports.fetchTokenChartData = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const graphql_tag_1 = __importDefault(require("graphql-tag"));
// format dayjs with the libraries that we need
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
const ONE_DAY_UNIX = 24 * 60 * 60;
const TOKEN_CHART = graphql_tag_1.default `
  query tokenDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
    tokenDayDatas(
      first: 1000
      skip: $skip
      where: { token: $address, date_gt: $startTime }
      orderBy: date
      orderDirection: asc
      subgraphError: allow
    ) {
      date
      volumeUSD
      totalValueLockedUSD
    }
  }
`;
function fetchTokenChartData(address, client) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        const startTimestamp = 1619170975;
        const endTimestamp = dayjs_1.default.utc().unix();
        let error = false;
        let skip = 0;
        let allFound = false;
        try {
            while (!allFound) {
                const { data: chartResData, errors, loading } = yield client.query({
                    query: TOKEN_CHART,
                    variables: {
                        address: address,
                        startTime: startTimestamp,
                        skip,
                    },
                    fetchPolicy: 'cache-first',
                });
                if (!loading) {
                    skip += 1000;
                    if (chartResData.tokenDayDatas.length < 1000 || error) {
                        allFound = true;
                    }
                    if (chartResData) {
                        data = data.concat(chartResData.tokenDayDatas);
                    }
                }
            }
        }
        catch (_c) {
            error = true;
        }
        if (data) {
            const formattedExisting = data.reduce((accum, dayData) => {
                const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0));
                accum[roundedDate] = {
                    date: dayData.date,
                    volumeUSD: parseFloat(dayData.volumeUSD),
                    totalValueLockedUSD: parseFloat(dayData.totalValueLockedUSD),
                };
                return accum;
            }, {});
            const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])];
            // fill in empty days ( there will be no day datas if no trades made that day )
            let timestamp = (_a = firstEntry === null || firstEntry === void 0 ? void 0 : firstEntry.date) !== null && _a !== void 0 ? _a : startTimestamp;
            let latestTvl = (_b = firstEntry === null || firstEntry === void 0 ? void 0 : firstEntry.totalValueLockedUSD) !== null && _b !== void 0 ? _b : 0;
            while (timestamp < endTimestamp - ONE_DAY_UNIX) {
                const nextDay = timestamp + ONE_DAY_UNIX;
                const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0));
                if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
                    formattedExisting[currentDayIndex] = {
                        date: nextDay,
                        volumeUSD: 0,
                        totalValueLockedUSD: latestTvl,
                    };
                }
                else {
                    latestTvl = formattedExisting[currentDayIndex].totalValueLockedUSD;
                }
                timestamp = nextDay;
            }
            const dateMap = Object.keys(formattedExisting).map((key) => {
                return formattedExisting[parseInt(key)];
            });
            return {
                data: dateMap,
                error: false,
            };
        }
        else {
            return {
                data: undefined,
                error,
            };
        }
    });
}
exports.fetchTokenChartData = fetchTokenChartData;
