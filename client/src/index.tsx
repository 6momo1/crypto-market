import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



// import Apollo
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useQuery } from '@apollo/client';





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


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
