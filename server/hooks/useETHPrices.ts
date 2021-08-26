import { EthereumNetworkInfo } from "../constants/networks"
import gql from 'graphql-tag'
import ApolloClient from "apollo-client"
import { useBlocksFromTimestamps } from "./useBlocksFromTimestamps"
import { useDeltaTimestamps } from "../utils/queries"
import { client } from "../apollo"

export interface EthPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

interface PricesResponse {
  current: {
    ethPriceUSD: string
  }[]
  oneDay: {
    ethPriceUSD: string
  }[]
  twoDay: {
    ethPriceUSD: string
  }[]
  oneWeek: {
    ethPriceUSD: string
  }[]
}

export const ETH_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundles(first: 1, subgraphError: allow) {
      ethPriceUSD
    }
    oneDay: bundles(first: 1, block: { number: $block24 }, subgraphError: allow) {
      ethPriceUSD
    }
    twoDay: bundles(first: 1, block: { number: $block48 }, subgraphError: allow) {
      ethPriceUSD
    }
    oneWeek: bundles(first: 1, block: { number: $blockWeek }, subgraphError: allow) {
      ethPriceUSD
    }
  }
`

export async function fetchEthPrices(
  blocks: [number, number, number],
  client: ApolloClient<any>
): Promise<{ data: EthPrices | undefined; error: boolean }> {
  try {
    const {data, loading } = await client.query<any>({
      query: ETH_PRICES,
      variables: {
        block24: blocks[0],
        block48: blocks[1],
        blockWeek: blocks[2] ?? 1,
      },
    })
    
    if (data) {
      return {
        data: {
          current: parseFloat(data.current[0].ethPriceUSD ?? 0),
          oneDay: parseFloat(data.oneDay[0]?.ethPriceUSD ?? 0),
          twoDay: parseFloat(data.twoDay[0]?.ethPriceUSD ?? 0),
          week: parseFloat(data.oneWeek[0]?.ethPriceUSD ?? 0),
        },
        error: false,
      }
    } else {
      return {
        data: undefined,
        error: true,
      }
    }
  } catch (e) {
    console.log(e)
    return {
      data: undefined,
      error: true,
    }
  }
}



/**
 * returns eth prices at current, 24h, 48h, and 1w intervals
 */
export async function useEthPrices(): Promise<EthPrices | undefined> {
  let prices: { [network: string]: EthPrices | undefined };

  let error = false
  let blocks
  const dataClient = client 

  const [t24, t48, tWeek] = useDeltaTimestamps()

  await useBlocksFromTimestamps([t24, t48, tWeek])
  .then(({blocks, error}) => {
    blocks = blocks
    error = error
  })

  console.log(" t24, t48, tWeek: ",t24, t48, tWeek)
  console.log("BLOCKS: ", blocks, error);
  

  // index on active network
  const indexedPrices = prices?.[EthereumNetworkInfo.id]

  const formattedBlocks = () => {
    if (blocks) {
      return blocks.map((b) => parseFloat(b.number))
    }
    else return undefined
  }
  console.log("FORMATTEDBLOCKS: ", formattedBlocks());
  
  
  async function fetch() {
      let { data, error } = await fetchEthPrices(formattedBlocks() as [number, number, number], dataClient)
      if (error) {
      error = true
      } else if (data) {
      prices = ({
          [EthereumNetworkInfo.id]: data,
      })
      }
  }
  // if (!indexedPrices && !error && formattedBlocks) {
  //     fetch()
  // }
  await fetch()

  return prices?.[EthereumNetworkInfo.id]
}

