import React, { useEffect } from 'react'
import { useFetchTokenDatas } from '../../data/tokens/tokenData'

const Token = () => {

  useEffect(() => {
    useFetchTokenDatas(["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"])
  }, [])

  return (
    <div>
      <h1>Token Page</h1>

    </div>
  )
}

export default Token
