import React, { useState, useEffect } from 'react';
import './App.css';
import { Search } from './components/Search'
import { useQuery, gql } from '@apollo/client'



function App() {

    const [pairAdrs, setPairAdrs] = useState("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11")
    const [count, setCount] = useState(5)
    const [swaps, setSwaps] = useState< any | undefined >([])

    // const { error, loading, data } = useQuery(LOAD_SWAPS)

  return (

        <div className="App">
            

            <label htmlFor="address">Pair Address:
                <input type="text" placeholder=""/>
            </label>
            <br />
            <label htmlFor="count">
                count:
                <input type="text" name="count" id="" onChange={e => setCount(parseInt(e.target.value))}/>
            </label>

            <Search></Search>

            <div>
                pair address: {pairAdrs} <br />
                count: {count} <br />
            </div>

            <button >
                fetch
            </button> 


            {/* <DataTable swaps={swaps}></DataTable> */}

        </div>
  );
}

export default App;
