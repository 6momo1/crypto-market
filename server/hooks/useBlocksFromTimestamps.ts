import ApolloClient from "apollo-client"
import { EthereumNetworkInfo } from "../constants/networks"
import { client } from "../apollo"
import { splitQuery } from "../utils/queries"
import gql from "graphql-tag"



export const GET_BLOCKS = (timestamps: string[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
        number
      }`
  })
  queryString += '}'
  return gql(queryString)
}


/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export async function useBlocksFromTimestamps(
  timestamps: number[],
  blockClientOverride?: ApolloClient<any>
): Promise<{
  blocks:
    | {
        timestamp: string
        number: any
      }[]
    | undefined
  error: boolean
}> {
  const activeNetwork = EthereumNetworkInfo
  let blocks: any
  let error: boolean = false

  // derive blocks based on active network
  const networkBlocks = blocks?.[activeNetwork.id]

    async function fetchData() {
        const results = await splitQuery(GET_BLOCKS, client, [], timestamps)
        console.log("------USEBLOCKSFROMTIMESTAMP--------RESULTS", results);
        
        if (results) {
        blocks = ({ ...(blocks ?? {}), [activeNetwork.id]: results })
        } else {
        error = true
        }
    }
    if (!networkBlocks && !error) {
        await fetchData()
        console.log("------USEBLOCKSFROMTIMESTAMP--------", blocks);
    }

    console.log("------USEBLOCKSFROMTIMESTAMP--------", blocks);
    

  const blocksFormatted = () => {
    if (blocks?.[activeNetwork.id]) {

      const networkBlocks = blocks?.[activeNetwork.id]
      const formatted:{ timestamp: string, number: any }[] | undefined = []

      for (const t in networkBlocks) {
        if (networkBlocks[t].length > 0) {
          formatted.push({
            timestamp: t.split('t')[1],
            number: networkBlocks[t][0]['number'],
          })
        }
      }
      return formatted
    }
  }

  return {
    blocks: blocksFormatted(),
    error,
  }
}