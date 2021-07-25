import axios from "axios";


const daiEth = `{
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
}`


const fetchGraphqlData = async(query) => {

  try {
      const result = await axios.post(
          'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
          {
            query: query
          }
      )
      console.log(result.data.data);
  } catch(error) {
    console.log(error);
  }

}


console.log("Fetching...");

fetchGraphqlData(daiEth);