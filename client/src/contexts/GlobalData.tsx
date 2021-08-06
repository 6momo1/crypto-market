import { any } from "prop-types"
import React, { createContext, useContext }  from "react"

const GlobalDataContext = createContext<any>([any])

const TokenDataContext = createContext<any>([any])

function useGlobalDataContext() {
    return useContext(GlobalDataContext)
}

export function useTokenDataContext() {
  return useContext(TokenDataContext)
}

export function useAllPairsInUniswap() {
  const [state] = useGlobalDataContext()
  let allPairs: any = state?.allPairs

  return allPairs || []
}


export function useAllTokensInUniswap() {
  const [state] = useGlobalDataContext()
  let allTokens = state?.allTokens

  return allTokens || []
}


export function useAllTokenData() {
  const [state] = useTokenDataContext()

  // filter out for only addresses
  return Object.keys(state)
    .filter((key) => key !== 'combinedVol')
    .reduce((res, key) => {
      res[key] = state[key]
      return res
    }, {})
}