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
exports.fetchTokenTransactions = exports.TransactionType = exports.formatTokenSymbol = exports.WETH_ADDRESS = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
function formatTokenSymbol(address, symbol) {
    if (address === exports.WETH_ADDRESS) {
        return 'ETH';
    }
    return symbol;
}
exports.formatTokenSymbol = formatTokenSymbol;
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["SWAP"] = 0] = "SWAP";
    TransactionType[TransactionType["MINT"] = 1] = "MINT";
    TransactionType[TransactionType["BURN"] = 2] = "BURN";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
const GLOBAL_TRANSACTIONS = graphql_tag_1.default `
  query transactions($address: Bytes!) {
    mintsAs0: mints(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      sender
      origin
      amount0
      amount1
      amountUSD
    }
    mintsAs1: mints(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      sender
      origin
      amount0
      amount1
      amountUSD
    }
    swapsAs0: swaps(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      origin
      amount0
      amount1
      amountUSD
    }
    swapsAs1: swaps(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token1: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      origin
      amount0
      amount1
      amountUSD
    }
    burnsAs0: burns(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      amount0
      amount1
      amountUSD
    }
    burnsAs1: burns(
      first: 500
      orderBy: timestamp
      orderDirection: desc
      where: { token1: $address }
      subgraphError: allow
    ) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      amount0
      amount1
      amountUSD
    }
  }
`;
function fetchTokenTransactions(address, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, errors, loading } = yield client.query({
                query: GLOBAL_TRANSACTIONS,
                variables: {
                    address: address,
                },
                fetchPolicy: 'cache-first',
            });
            if (errors) {
                return {
                    data: undefined,
                    error: true,
                    loading: false,
                };
            }
            if (loading && !data) {
                return {
                    data: undefined,
                    error: false,
                    loading: true,
                };
            }
            const mints0 = data.mintsAs0.map((m) => {
                return {
                    type: TransactionType.MINT,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.origin,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            const mints1 = data.mintsAs1.map((m) => {
                return {
                    type: TransactionType.MINT,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.origin,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            const burns0 = data.burnsAs0.map((m) => {
                return {
                    type: TransactionType.BURN,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.owner,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            const burns1 = data.burnsAs1.map((m) => {
                return {
                    type: TransactionType.BURN,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.owner,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            const swaps0 = data.swapsAs0.map((m) => {
                return {
                    type: TransactionType.SWAP,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.origin,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            const swaps1 = data.swapsAs1.map((m) => {
                return {
                    type: TransactionType.SWAP,
                    hash: m.transaction.id,
                    timestamp: m.timestamp,
                    sender: m.origin,
                    token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
                    token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
                    token0Address: m.pool.token0.id,
                    token1Address: m.pool.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
            return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false, loading: false };
        }
        catch (_a) {
            return {
                data: undefined,
                error: true,
                loading: false,
            };
        }
    });
}
exports.fetchTokenTransactions = fetchTokenTransactions;
