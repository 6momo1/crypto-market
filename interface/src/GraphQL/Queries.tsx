import {gql} from '@apollo/client'


export const LOAD_SWAPS = gql`
{
      swaps(first: 5, where: { pair: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" } orderBy: timestamp, orderDirection: desc) {
        transaction {
          id
          timestamp
        }
        id
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        to
      }
  }
`

export const LOAD_SWAPS_MM = gql `
{
      swaps(first: 5, where: { pair: "0x84383fb05F610222430F69727aA638F8FdbF5Cc1" } orderBy: timestamp, orderDirection: desc) {
        transaction {
          id
          timestamp
        }
        id
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        to
      }
  }
`
