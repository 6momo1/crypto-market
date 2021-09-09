import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { ONE_HOUR_SECONDS, ONE_MINUTE_SECONDS, TimeWindow } from '../../constants/intervals'

/**
 * Formatted type for Candlestick charts
 */
export type PriceChartEntry = {
  time: number // unix timestamp
  open: number
  close: number
  high: number
  low: number
}

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

export const PRICES_BY_BLOCK = (tokenAddress: string, blocks: any) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }, subgraphError: allow) { 
        derivedETH
      }
    `
  )
  queryString += ','
  queryString += blocks.map(
    (block: any) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }, subgraphError: allow) { 
        ethPriceUSD
      }
    `
  )

  queryString += '}'
  return gql(queryString)
}

const PRICE_CHART = gql`
  query tokenHourDatas($address: Bytes!) {
    tokenHourDatas(
      first: 100
      where: { token: $address }
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      high
      low
      open
      close
    }
  }
`

interface PriceResults {
  tokenHourDatas: {
    periodStartUnix: number
    high: string
    low: string
    open: string
    close: string
  }[]
}

async function fetchTokenPriceData(
  address: string,
  startTimestamp: number,
  dataClient: ApolloClient<any>,
): Promise<{
  data: PriceChartEntry[]
  error: boolean
}> {
  // start and end bounds

  try {
   
    let data: {
      periodStartUnix: number
      high: string
      low: string
      open: string
      close: string
    }[] = []

    let skip = 0
    let allFound = false
    let error = false

      const { data: priceData, errors, loading } = await dataClient.query<PriceResults>({
        query: PRICE_CHART,
        variables: {
          address: address
        },
        fetchPolicy: 'no-cache',
      })
      if (!loading) {
        if (priceData) {
          data = data.concat(priceData.tokenHourDatas)
        }
      }
      if (errors) {
        error = true
        console.log(errors);
        
      }

    const formattedHistory = data.map((d) => {
      return {
        time: d.periodStartUnix,
        open: parseFloat(d.open),
        close: parseFloat(d.close),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
      }
    })

    return {
      data: formattedHistory,
      error
    }
  } catch (e) {
    console.log(e)
    return {
      data: [],
      error: true,
    }
  }
}


// fetch token price data
export async function fetchCurrentPriceData(
    address: string,
    client: ApolloClient<any>
):
Promise<{
    data: PriceChartEntry[],
    error: boolean
}>
{
    const startTimestamp = Math.round(new Date().getTime() / 1000)
    const { data, error } = await fetchTokenPriceData(
        address,
        startTimestamp, 
        client,
    )
    return {data, error}
}