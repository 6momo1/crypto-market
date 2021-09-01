
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { escapeRegExp } from '../../utils'

interface TokenRes {
  asSymbol: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asName: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asAddress: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
}

interface PoolResFields {
  id: string
  feeTier: string
  token0: {
    id: string
    symbol: string
    name: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

interface PoolRes {
  as0: PoolResFields[]
  as1: PoolResFields[]
  asAddress: PoolResFields[]
}

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(
      where: { symbol_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asName: tokens(
      where: { name_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      symbol
      name
      totalValueLockedUSD
    }
  }
`

export const POOL_SEARCH = gql`
  query pools($tokens: [Bytes]!, $id: String) {
    as0: pools(where: { token0_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    as1: pools(where: { token1_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    asAddress: pools(where: { id: $id }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

// fetch data based on search input
export async function fetchSearchResults( 
  value: string,
  client: ApolloClient<any>
): 
Promise<{
  tokenRes: TokenRes | undefined, 
  PoolRes: PoolRes | undefined
}> {

  let tokensFetched: TokenRes = null
  let poolsFetched: PoolRes = null

  async function fetch() {
      try {
          const tokens = await client.query({
          query: TOKEN_SEARCH,
          variables: {
              value: value ? value.toUpperCase() : '',
              id: value,
          },
          })
          const pools = await client.query({
          query: POOL_SEARCH,
          variables: {
              tokens: tokens.data.asSymbol?.map((t) => t.id),
              id: value,
          },
          })

          if (tokens.data) {
            tokensFetched = tokens.data
            
          }
          if (pools.data) {
              poolsFetched = pools.data

          }
      } catch (e) {
          console.log(e)
      }
  }

  if (value && value.length > 0) {
    await fetch()
  }

  return {tokenRes: tokensFetched, PoolRes: poolsFetched}

}
