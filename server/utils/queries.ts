import ApolloClient from "apollo-client"
import dayjs from "dayjs"


/**
 * Used to get large amounts of data when
 * @param query
 * @param localClient
 * @param vars - any variables that are passed in every query
 * @param values - the keys that are used as the values to map over if
 * @param skipCount - amount of entities to skip per query
 */
export async function splitQuery<Type>(
  query: any,
  client: ApolloClient<any>,
  vars: any[],
  values: any[],
  skipCount = 1000
) {
  console.log("-------SPLIT QUERY CALLED-----------");
  
  let fetchedData = {}
  let allFound = false
  let skip = 0
  try {
    while (!allFound) {
      let end = values.length
      if (skip + skipCount < values.length) {
        end = skip + skipCount
      }
      const sliced = values.slice(skip, end)
      const result = await client.query<any>({
        query: query(...vars, sliced),
        fetchPolicy: 'network-only',
      })
      console.log();
      console.log("-------SPLIT QUERY RESULTS-----------", result);
      console.log("-------SPLIT QUERY RESULTS-----------DATA: ", result.data);
      console.log("-------SPLIT QUERY RESULTS-----------ERROR: ", result.errors[0].locations);
      console.log("-------SPLIT QUERY RESULTS-----------", result.errors[1].locations);
      console.log("-------SPLIT QUERY RESULTS-----------", result.errors[2].locations);
      
      fetchedData = {
        ...fetchedData,
        ...result.data,
      }
      if (Object.keys(result.data).length < skipCount || skip + skipCount > values.length) {
        allFound = true
      } else {
        skip += skipCount
      }
    }
    return fetchedData
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export function useDeltaTimestamps(): [number, number, number] {
  const utcCurrentTime = dayjs()
  const t1 = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()
  const t2 = utcCurrentTime.subtract(2, 'day').startOf('minute').unix()
  const tWeek = utcCurrentTime.subtract(1, 'week').startOf('minute').unix()
  return [t1, t2, tWeek]
}

