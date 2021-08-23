import React, { useState, useMemo, useRef }from 'react'



export const Search = ({ ...rest}: React.HTMLAttributes<HTMLDivElement>) => {
  
  const ref = useRef<HTMLInputElement>(null)


  // get network version
  // const [activeNetwork] = useActiveNetworkVersion()

  const [tokensShown, setTokensShown] = useState(3)
  const [poolsShown, setPoolsShown] = useState(3)

  // get value results
  const [value, setValue] = useState('')
  const { tokens, pools } = useFetchSearchResults(value)

  // get date for watchlist
  const watchListTokenData = useTokenDatas(savedTokens)
  const watchListPoolData = usePoolDatas(savedPools)


  // const [showWatchlist, setShowWatchlist] = useState(false) 
  const showWatchlist = true;

  // sort tokens for listing
  const tokensForList = useMemo(
    () => (showWatchlist ? watchListTokenData ?? [] : tokens.sort((t0, t1) => (t0.volumeUSD > t1.volumeUSD ? -1 : 1))),
    [showWatchlist, tokens, watchListTokenData]
  )

  // sort pools for listing
  const poolForList = useMemo(
    () => (showWatchlist ? watchListPoolData ?? [] : pools.sort((p0, p1) => (p0.volumeUSD > p1.volumeUSD ? -1 : 1))),
    [pools, showWatchlist, watchListPoolData]
  )
  return (
    <div>

      <input
        type="text"
        value={value}
        onChange={ (e) => {
          setValue(e.target.value)
        }}
        placeholder="Search pools or tokens"
        ref={ref}
      />


      
    </div>
  )
}

export default Search
