import React, { useEffect } from 'react'
import { useFetchTokenDatas } from '../../data/tokens/tokenData'
import { useParams } from 'react-router'
import gql from "graphql-tag";
import { ApolloError, useQuery } from "@apollo/client";
import { client } from "../../apollo";
import Loader from '../../components/Loader';
import Error from '../../components/Error';

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

type TokenParams = {
  id: string,
}

const Token = () => {

  const { id } = useParams<TokenParams>()
  
  const {
    data,
    error,
    loading,
  } = useQuery<TokenDataResponse | undefined>(
    TOKENS_BULK(undefined, [id]),
    {
      client: client,
    }
  );
  const parsedData = data?.tokens
    ? data.tokens.reduce(
        (accum: { [address: string]: TokenFields }, poolData) => {
          accum[poolData.id] = poolData;
          return accum;
        },
        {}
      )
    : {};

  return (
    <div>
      {data && <div>
        <h1>Token Page for address: {id}</h1>
        <p>data: {JSON.stringify(parsedData)}</p>
      </div> }

      {loading && <Loader />}

      {error && <Error />}

    </div>
  )
}

export default Token
