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
const queries_1 = require("../../utils/queries");
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
        const dataClient = apollo_1.client;
        // get blocks from historic timestamps
        const [t24, t48, tWeek] = queries_1.useDeltaTimestamps();
        // const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
        // const [block24, block48, blockWeek] = blocks ?? []
        // const ethPrices = useEthPrices()
        let loading;
        let error;
        let data;
        yield apollo_1.client.query({ query: exports.TOKENS_BULK(undefined, tokenAddresses) })
            .then((res) => {
            console.log(res.data);
            loading = res.loading;
            error = res.errors;
            data = res.data;
        });
        // const { loading: loading24, error: error24, data: data24 } = client.query<TokenDataResponse>(
        //   TOKENS_BULK(parseInt(block24?.number), tokenAddresses),
        //   {
        //     client: dataClient,
        //   }
        // )
        // const { loading: loading48, error: error48, data: data48 } = client.query<TokenDataResponse>(
        //   TOKENS_BULK(parseInt(block48?.number), tokenAddresses),
        //   {
        //     client: dataClient,
        //   }
        // )
        // const { loading: loadingWeek, error: errorWeek, data: dataWeek } = client.query<TokenDataResponse>(
        //   TOKENS_BULK(parseInt(blockWeek?.number), tokenAddresses),
        //   {
        //     client: dataClient,
        //   }
        // )
        // const anyError = Boolean(error || error24 || error48 || blockError || errorWeek)
        // const anyLoading = Boolean(loading || loading24 || loading48 || loadingWeek )
        // if (!ethPrices) {
        //   return {
        //     loading: true,
        //     error: false,
        //     data: undefined,
        //   }
        // }
        // // return early if not all data yet
        // if (anyError || anyLoading) {
        //   return {
        //     loading: anyLoading,
        //     error: anyError,
        //     data: undefined,
        //   }
        // }
        const parsed = (data === null || data === void 0 ? void 0 : data.tokens)
            ? data.tokens.reduce((accum, poolData) => {
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        console.log("parsed: ", parsed);
        // const parsed24 = data24?.tokens
        //   ? data24.tokens.reduce((accum: { [address: string]: TokenFields }, poolData) => {
        //       accum[poolData.id] = poolData
        //       return accum
        //     }, {})
        //   : {}
        // const parsed48 = data48?.tokens
        //   ? data48.tokens.reduce((accum: { [address: string]: TokenFields }, poolData) => {
        //       accum[poolData.id] = poolData
        //       return accum
        //     }, {})
        //   : {}
        // const parsedWeek = dataWeek?.tokens
        //   ? dataWeek.tokens.reduce((accum: { [address: string]: TokenFields }, poolData) => {
        //       accum[poolData.id] = poolData
        //       return accum
        //     }, {})
        //   : {}
        // format data and calculate daily changes
        // const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
        //   const current: TokenFields | undefined = parsed[address]
        //   const oneDay: TokenFields | undefined = parsed24[address]
        //   const twoDay: TokenFields | undefined = parsed48[address]
        //   const week: TokenFields | undefined = parsedWeek[address]
        //   const [volumeUSD, volumeUSDChange] =
        //     current && oneDay && twoDay
        //       ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
        //       : current
        //       ? [parseFloat(current.volumeUSD), 0]
        //       : [0, 0]
        //   const volumeUSDWeek =
        //     current && week
        //       ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
        //       : current
        //       ? parseFloat(current.volumeUSD)
        //       : 0
        //   const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0
        //   const tvlUSDChange = getPercentChange(current?.totalValueLockedUSD, oneDay?.totalValueLockedUSD)
        //   const tvlToken = current ? parseFloat(current.totalValueLocked) : 0
        //   const priceUSD = current ? parseFloat(current.derivedETH) * ethPrices.current : 0
        //   const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedETH) * ethPrices.oneDay : 0
        //   const priceUSDWeek = week ? parseFloat(week.derivedETH) * ethPrices.week : 0
        //   const priceUSDChange =
        //     priceUSD && priceUSDOneDay ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString()) : 0
        //   const priceUSDChangeWeek =
        //     priceUSD && priceUSDWeek ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString()) : 0
        //   const txCount =
        //     current && oneDay
        //       ? parseFloat(current.txCount) - parseFloat(oneDay.txCount)
        //       : current
        //       ? parseFloat(current.txCount)
        //       : 0
        //   const feesUSD =
        //     current && oneDay
        //       ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
        //       : current
        //       ? parseFloat(current.feesUSD)
        //       : 0
        //   accum[address] = {
        //     exists: !!current,
        //     address,
        //     name: current ? formatTokenName(address, current.name) : '',
        //     symbol: current ? formatTokenSymbol(address, current.symbol) : '',
        //     volumeUSD,
        //     volumeUSDChange,
        //     volumeUSDWeek,
        //     txCount,
        //     tvlUSD,
        //     feesUSD,
        //     tvlUSDChange,
        //     tvlToken,
        //     priceUSD,
        //     priceUSDChange,
        //     priceUSDChangeWeek,
        //   }
        //   return accum
        // }, {})
        // return {
        //   loading: anyLoading,
        //   error: anyError,
        //   data: formatted,
        // }
        return {
            loading: false,
            error: false,
            data: undefined
        };
    });
}
exports.useFetchedTokenDatas = useFetchedTokenDatas;
