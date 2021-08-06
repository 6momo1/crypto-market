import { any } from "prop-types"
import React, { useContext, createContext } from "react"





const PairDataContext = createContext([any])

function usePairDataContext() {
  return useContext(PairDataContext)
}



export function useAllPairData() {
  const [state] = usePairDataContext()
  return state || {}
}