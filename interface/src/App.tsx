import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { fetchGraphqlData } from './utils/fetchData';
import GetSwaps from './components/GetSwaps';
import { LOAD_SWAPS, LOAD_SWAPS_MM } from './GraphQL/Queries';
import DataTable from './components/DataTable'


import { useQuery, gql } from '@apollo/client'

interface Swap {
"__typename": string,
"transaction": string,
"id": string,
"pair": string,
"amount0In": string,
"amount0Out": string,
"amount1In": string,
"amount1Out": string,
"amountUSD": string,
"to": string
}

function App() {

    const [pairAdrs, setPairAdrs] = useState("0xaA934346e4f74bC23e62153Ee964dF8B826694eF")
    const [count, setCount] = useState(5)
    const [swaps, setSwaps] = useState<Swap[] | null | undefined >(null)

    // const { error, loading, data } = useQuery(LOAD_SWAPS)
    const { error, loading, data } = useQuery(LOAD_SWAPS_MM)

    useEffect(() => {
        
        if (!error) {
            // setSwaps(data["swaps"])
            console.log(data);
            
        }


    }, [data])


  return (

        <div className="App">
            <Navbar></Navbar>
            

            <label htmlFor="address">Pair Address:
                <input type="text" placeholder=""/>
            </label>
            <br />
            <label htmlFor="count">
                count:
                <input type="text" name="count" id="" onChange={e => setCount(parseInt(e.target.value))}/>
            </label>
            <div>
                pair address: {pairAdrs} <br />
                count: {count} <br />
            </div>

            <button >
                fetch
            </button> 


            <DataTable swaps={swaps}></DataTable>

        </div> 
  );
}

export default App;
