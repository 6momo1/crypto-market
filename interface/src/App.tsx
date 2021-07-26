import React, { useState } from 'react';
import { Container, Col } from 'react-bootstrap';
import './App.css';
import Infotab from './components/Infotab';
import Navbar from './components/Navbar';
import { fetchGraphqlData } from './utils/fetchData';
function App() {

    const [data, setData] = useState("")
    const [pairAdrs, setPairAdrs] = useState("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11")
    const [count, setCount] = useState(5)


    function handleFetch(e:any) {
        console.log("handle fetch called ");
        
        e.preventDefault()
        setData("fetched")
        
        // fetch data
        fetchGraphqlData(pairAdrs, 10)
        .then(ret => {
            // setData(ret)
            console.log(ret);
            
            
        })
        .catch( error => {
            console.log(error);
        })
    }

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
            data: {data} <br />
        </div>

        <button onClick={handleFetch}>
            fetch
        </button>
        
    </div>
  );
}

export default App;
