import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { fetchGraphqlData } from './utils/fetchData';
import GetSwaps from './components/GetSwaps';
import { LOAD_DAI_ETH } from './GraphQL/Queries';
import DataTable from './components/DataTable'
import { Swap } from './Interfaces'

import { useQuery, gql } from '@apollo/client'



function App() {

    const [pairAdrs, setPairAdrs] = useState("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11")
    const [count, setCount] = useState(5)
    const [swaps, setSwaps] = useState<Swap[] | undefined >([])

    // const { error, loading, data } = useQuery(LOAD_SWAPS)
    const { error, loading, data } = useQuery(LOAD_DAI_ETH)

    useEffect(() => {
        
        if (!error && !loading) {
            setSwaps(data["swaps"])
            console.log("data fetched");   
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
