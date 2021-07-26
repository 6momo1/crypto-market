import React, { useState, useEffect } from 'react';
import { Container, Col } from 'react-bootstrap';
import './App.css';
import Infotab from './components/Infotab';
import Navbar from './components/Navbar';
import { fetchGraphqlData } from './utils/fetchData';


// import Apollo
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import GetSwaps from './components/GetSwaps';
import { useQuery } from '@apollo/client';
import { LOAD_SWAPS } from './GraphQL/Queries';



const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});


const link = from([
  errorLink,
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {

    const [pairAdrs, setPairAdrs] = useState("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11")
    const [count, setCount] = useState(5)

    const {error, loading, data} = useQuery(LOAD_SWAPS)

    useEffect(() => {
        console.log(data);
     
    }, [data])

    function handleFetch(e:any) {
        console.log("handle fetch called ");
    }

  return (
    <ApolloProvider client={client} >

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

            <button onClick={handleFetch}>
                fetch
            </button> 

            <GetSwaps/>

        </div> 
        
    </ApolloProvider>
  );
}

export default App;
