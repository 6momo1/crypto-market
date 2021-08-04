interface transaction {
    id: string,
    timestamp: string,
    __typename: string,
}

export interface Swap {
"__typename": string,
"transaction": transaction,
"id": string,
"pair": string,
"amount0In": string,
"amount0Out": string,
"amount1In": string,
"amount1Out": string,
"amountUSD": string,
"to": string
}

export interface BasicData {
  token0?: {
    id: string
    name: string
    symbol: string
  }
  token1?: {
    id: string
    name: string
    symbol: string
  }
}

export interface QueryResult {
    data: []
}