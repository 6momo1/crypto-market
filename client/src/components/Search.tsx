import React ,{ useEffect, useState, useMemo } from 'react'
import { TOKEN_SEARCH, PAIR_SEARCH } from '../GraphQL/Queries'
import { PAIR_BLACKLIST } from '../constants'
import { client } from '../apollo/client'
import { ApolloQueryResult } from '@apollo/client/core'
import { BasicData } from '../interfaces';
import { updateNameData } from '../utils/data';
import { useAllPairsInUniswap, useAllTokenData, useAllTokensInUniswap } from '../contexts/GlobalData';
import { useAllPairData } from '../contexts/PairData';


export const Search: React.FC = () => {

    const [value, setValue] = useState("")
    const [searchedPairs, setSearchedPairs] = useState<any>([])
    const [searchedTokens, setSearchedTokens] = useState<any>([])

    let allTokens = useAllTokensInUniswap()
    const allTokenData = useAllTokenData()


    let allPairData = useAllPairData()
    let allPairs = useAllPairsInUniswap()


    useEffect(() => {
    async function fetchData() {
      try {
        if (value?.length > 0) {
          let tokens = await client.query({
            query: TOKEN_SEARCH,
            variables: {
              value: value ? value.toUpperCase() : '',
              id: value,
            },
          })

          let pairs: ApolloQueryResult<any> = await client.query({
            query: PAIR_SEARCH,
            variables: {
              tokens: tokens.data.asSymbol?.map((t) => t.id),
              id: value,
            },
          })
          
          // format pairs to searched pairs format
          setSearchedPairs(
            updateNameData(pairs.data.as0)
              .concat(updateNameData(pairs.data.as1))
          )
          
          const foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
          setSearchedTokens(foundTokens)
          console.log("Found tokens: ", foundTokens);
          console.log("Searched Pairs:", searchedPairs);
          console.log("Pairs: ", pairs);

          console.log("filtered pair", filteredPairList);

        }
      } catch (e) {
        console.log(e)
      }
    }


    fetchData()
    
  }, [value])


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  // add the searched tokens to the list if not found yet
  allTokens = allTokens.concat(
    searchedTokens.filter((searchedToken) => {
      let included = false
      allTokens.map((token) => {
        if (token.id === searchedToken.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniqueTokens: any = []
  let found: any = {}
  allTokens &&
    allTokens.map((token) => {
      if (!found[token.id]) {
        found[token.id] = true
        uniqueTokens.push(token)
      }
      return true
    })

  allPairs = allPairs.concat(
    searchedPairs.filter((searchedPair) => {
      let included = false
      allPairs.map((pair) => {
        if (pair.id === searchedPair.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniquePairs:any = []
  let pairsFound:any = {}
  allPairs &&
    allPairs.map((pair) => {
      if (!pairsFound[pair.id]) {
        pairsFound[pair.id] = true
        uniquePairs.push(pair)
      }
      return true
    })

     const filteredPairList = useMemo(() => {
    return uniquePairs
      ? uniquePairs
          .sort((a, b) => {
            const pairA = allPairData[a.id]
            const pairB = allPairData[b.id]
            if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return parseFloat(pairA.trackedReserveETH) > parseFloat(pairB.trackedReserveETH) ? -1 : 1
            }
            if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
              return -1
            }
            if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return 1
            }
            return 0
          })
          .filter((pair) => {
            if (PAIR_BLACKLIST.includes(pair.id)) {
              return false
            }
            if (value && value.includes(' ')) {
              const pairA = value.split(' ')[0]?.toUpperCase()
              const pairB = value.split(' ')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            if (value && value.includes('-')) {
              const pairA = value.split('-')[0]?.toUpperCase()
              const pairB = value.split('-')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            const regexMatches = Object.keys(pair).map((field) => {
              const isAddress = value.slice(0, 2) === '0x'
              if (field === 'id' && isAddress) {
                return pair[field].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (field === 'token0') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              if (field === 'token1') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              return false
            })
            return regexMatches.some((m) => m)
          })
      : []
  }, [allPairData, uniquePairs, value])


    return (
        <div>
            <input
                placeholder='Search...'
                value={value}
                onChange={(e) => {
                setValue(e.target.value)
                }}
            />


        {filteredPairList && 
        filteredPairList.slice(0,5).map((pair) => {
          updateNameData(pair)
          return (
            <div>
              {pair.token0.symbol + '-' + pair.token1.symbol} Pair
            </div>
          )
        })
        }

        </div>
    )
};

export default Search;