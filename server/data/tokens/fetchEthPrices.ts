import axios, { Method } from 'axios'

export const fetchEthPrice = async () => {
  const data = await axios({
    method: 'GET' as Method,
    url:"https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1"
  })
  return data.data.prices[data.data.prices.length - 1][1]
}