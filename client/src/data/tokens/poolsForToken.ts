import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

export const POOLS_FOR_TOKEN = gql`
  query topPools($address: Bytes!) {
    asToken0: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      id
    }
    asToken1: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token1: $address }
      subgraphError: allow
    ) {
      id
    }
  }
`

interface PoolsForTokenResponse {
  asToken0: {
    id: string
  }[]
  asToken1: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolsForToken(
  address: string,
  client: ApolloClient<any>
): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const { loading, errors, data } = await client.query<PoolsForTokenResponse>({
      query: POOLS_FOR_TOKEN,
      variables: {
        address: address,
      },
      fetchPolicy: 'cache-first',
    })

    if (loading || errors || !data) {
      return {
        loading,
        error: Boolean(errors),
        addresses: undefined,
      }
    }

    const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id)

    return {
      loading,
      error: Boolean(errors),
      addresses: formattedData,
    }
  } catch {
    return {
      loading: false,
      error: true,
      addresses: undefined,
    }
  }
}

