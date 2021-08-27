"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const apollo_link_http_1 = require("apollo-link-http");
const node_fetch_1 = __importDefault(require("node-fetch"));
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const apollo_client_1 = __importDefault(require("apollo-client"));
const uri = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const httpLink = apollo_link_http_1.createHttpLink({ uri, fetch: node_fetch_1.default });
exports.client = new apollo_client_1.default({
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
});
