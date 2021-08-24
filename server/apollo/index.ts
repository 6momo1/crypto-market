import { DocumentNode, execute, makePromise } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { gql } from 'graphql-tag'
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
import ApolloClient from 'apollo-client'

const uri = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
const httpLink = createHttpLink( {uri, fetch })

export const client = new ApolloClient<any>({
  link: httpLink,
  cache: new InMemoryCache(),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})


