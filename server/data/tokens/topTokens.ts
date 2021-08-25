import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

export const TOP_TOKENS = gql`
  query topPools {
    tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

interface TopTokensResponse {
  tokens: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function useTopTokenAddresses(client:ApolloClient<any>): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined,
}> {

  const { loading, errors, data } = await client.query<TopTokensResponse>({query:TOP_TOKENS})

  const formattedData = () => {
    if (data) {
      return data.tokens.map((t) => t.id)
    } else {
      return undefined
    }
  }

  return {
    loading: loading,
    error: Boolean(errors),
    addresses: formattedData(),
  }
}

