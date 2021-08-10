import axios from "axios";


export {
  fetchGraphqlData
}


function generateQuery(pairAddress: string, entries: number): string {

  const res = `{
      swaps(first: ${entries}, where: { pair: "${pairAddress}" } orderBy: timestamp, orderDirection: desc) {
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

  return res
}


const fetchGraphqlData = async( pairAddress: string, entries: number ) :Promise<string>  => {

  const query = generateQuery(pairAddress, entries);
    console.log(query);
    
  try {
      const result = await axios.post(
          'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
          {
            query: query
          }
      )
    //   console.log(result.data.data);
      return result.data.data;
  } catch(error) {
    console.log(error);
    return error
  }
}

