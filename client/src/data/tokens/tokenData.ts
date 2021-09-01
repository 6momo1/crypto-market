import gql from "graphql-tag";
import { ApolloError, useQuery } from "@apollo/client";
import { client } from "../../apollo";
import { useState, useEffect } from "react";

export type TokenData = {
  // token is in some pool on uniswap
  exists: boolean;

  // basic token info
  name: string;
  symbol: string;
  address: string;

  // volume
  volumeUSD: number;
  volumeUSDChange: number;
  volumeUSDWeek: number;
  txCount: number;

  //fees
  feesUSD: number;

  // tvl
  tvlToken: number;
  tvlUSD: number;
  tvlUSDChange: number;

  priceUSD: number;
  priceUSDChange: number;
  priceUSDChangeWeek: number;
};

export const TOKENS_BULK = (block: number | undefined, tokens: string[]) => {
  let tokenString = `[`;
  tokens.map((address) => {
    return (tokenString += `"${address}",`);
  });
  tokenString += "]";
  const queryString =
    `
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
  return gql(queryString);
};

interface TokenFields {
  id: string;
  symbol: string;
  name: string;
  derivedETH: string;
  volumeUSD: string;
  volume: string;
  feesUSD: string;
  txCount: string;
  totalValueLocked: string;
  totalValueLockedUSD: string;
}

interface TokenDataResponse {
  tokens: TokenFields[];
}

/**
 * Fetch top addresses by volume
 */
export const useFetchTokenDatas = (tokenAddresses: string[]) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<
    { [address: string]: TokenFields } | undefined
  >(undefined);

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery<TokenDataResponse | undefined>(
    TOKENS_BULK(undefined, tokenAddresses),
    {
      client: client,
    }
  );

  const parsed = queryData?.tokens
    ? queryData.tokens.reduce(
        (accum: { [address: string]: TokenFields }, poolData) => {
          accum[poolData.id] = poolData;
          return accum;
        },
        {}
      )
    : {};

  if (queryError) {
    setError(true);
  }
  if (queryLoading) {
    setLoading(true);
  }
  if (queryData) {
  setData(parsed);
  }

  return { data, error, loading };
};
