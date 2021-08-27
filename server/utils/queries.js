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
exports.useDeltaTimestamps = exports.splitQuery = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
/**
 * Used to get large amounts of data when
 * @param query
 * @param localClient
 * @param vars - any variables that are passed in every query
 * @param values - the keys that are used as the values to map over if
 * @param skipCount - amount of entities to skip per query
 */
function splitQuery(query, client, vars, values, skipCount = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("-------SPLIT QUERY CALLED-----------");
        let fetchedData = {};
        let allFound = false;
        let skip = 0;
        try {
            while (!allFound) {
                let end = values.length;
                if (skip + skipCount < values.length) {
                    end = skip + skipCount;
                }
                const sliced = values.slice(skip, end);
                const result = yield client.query({
                    query: query(...vars, sliced),
                    fetchPolicy: 'network-only',
                });
                console.log();
                console.log("-------SPLIT QUERY RESULTS-----------", result);
                console.log("-------SPLIT QUERY RESULTS-----------DATA: ", result.data);
                console.log("-------SPLIT QUERY RESULTS-----------ERROR: ", result.errors[0].locations);
                console.log("-------SPLIT QUERY RESULTS-----------", result.errors[1].locations);
                console.log("-------SPLIT QUERY RESULTS-----------", result.errors[2].locations);
                fetchedData = Object.assign(Object.assign({}, fetchedData), result.data);
                if (Object.keys(result.data).length < skipCount || skip + skipCount > values.length) {
                    allFound = true;
                }
                else {
                    skip += skipCount;
                }
            }
            return fetchedData;
        }
        catch (e) {
            console.log(e);
            return undefined;
        }
    });
}
exports.splitQuery = splitQuery;
function useDeltaTimestamps() {
    const utcCurrentTime = dayjs_1.default();
    const t1 = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();
    const t2 = utcCurrentTime.subtract(2, 'day').startOf('minute').unix();
    const tWeek = utcCurrentTime.subtract(1, 'week').startOf('minute').unix();
    return [t1, t2, tWeek];
}
exports.useDeltaTimestamps = useDeltaTimestamps;
