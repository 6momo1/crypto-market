import React ,{ useEffect, useState } from 'react'
import { TOKEN_SEARCH, PAIR_SEARCH } from '../GraphQL/Queries'
import { client } from '../apollo/client'
import { ApolloQueryResult } from '@apollo/client/core'



export const Search: React.FC = () => {

    const [value, setValue] = useState("")
    const [searchedPairs, setSearchedPairs] = useState([])
    const [searchedTokens, setSearchedTokens] = useState([])

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

        //   let pairs: ApolloQueryResult<any> = await client.query({
        //     query: PAIR_SEARCH,
        //     variables: {
        //       tokens: tokens.data.asSymbol?.map((t) => t.id),
        //       id: value,
        //     },
        //   })

        //   updateNameData(pairs.data.as0)
        //     .concat(updateNameData(pairs.data.as1))
        //     .concat(updateNameData(pairs.data.asAddress))

        
          const foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
          setSearchedTokens(foundTokens)
          console.log(foundTokens);
          
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [value])


    return (
        <div>
            <input
                placeholder='Search...'
                value={value}
                onChange={(e) => {
                setValue(e.target.value)
                }}
            />
        </div>
    )
};

export default Search;