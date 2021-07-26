import React, {useEffect} from 'react'
import { useQuery, gql } from '@apollo/client'
import { LOAD_SWAPS } from '../GraphQL/Queries'


const GetSwaps = () => {


    const {error, loading, data} = useQuery(LOAD_SWAPS)

    useEffect(() => {
        console.log(data);
     
    }, [data])

    return (
        <div>
            
        </div>
    )
}

export default GetSwaps