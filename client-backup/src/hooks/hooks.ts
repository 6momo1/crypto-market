import { AppState, AppDispatch } from './../index'
import { NetworkInfo } from "../types/networks"
import { useDispatch, useSelector } from "react-redux"
import { useCallback, useMemo } from 'react'
import { TokenData } from '../types/'
import { addTokenKeys } from './actions'

export function useAllTokenData(): {
  [address: string]: { data: TokenData | undefined; lastUpdated: number | undefined }
} {
  const [activeNetwork] = useActiveNetworkVersion()
  return useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id] ?? {})
}


export function useAddTokenKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  const [activeNetwork] = useActiveNetworkVersion()
  return useCallback(
    (tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
}

// this function returns a list of tokens
export function useTokenDatas(addresses: string[] | undefined): TokenData[] | undefined {
  const allTokenData = useAllTokenData()
  const addTokenKeys = useAddTokenKeys()

  // if token not tracked yet track it
  addresses?.map((a) => {
    if (!allTokenData[a]) {
      addTokenKeys([a])
    }
  })
}