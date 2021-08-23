"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apollo = exports.client = void 0;
const apollo_link_http_1 = require("apollo-link-http");
const node_fetch_1 = __importDefault(require("node-fetch"));
const graphql_tag_1 = require("graphql-tag");
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const ApolloClient = require("apollo-client").ApolloClient;
const uri = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const httpLink = apollo_link_http_1.createHttpLink({ uri, fetch: node_fetch_1.default });
exports.client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});
const query = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.query) {
        res.sendStatus(500);
        return;
    }
    const query = graphql_tag_1.gql(req.body.query);
    let variables = undefined;
    if (req.body.variables) {
        variables = JSON.parse(decodeURIComponent(req.body.variables));
    }
    try {
        const result = yield exports.client.query({
            query,
            variables
        });
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).send(JSON.stringify(err));
    }
});
const mutate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.query) {
        res.sendStatus(500);
        return;
    }
    const query = graphql_tag_1.gql(req.body.query);
    let variables = undefined;
    if (req.body.variables) {
        variables = JSON.parse(decodeURIComponent(req.body.variables));
    }
    try {
        const result = yield exports.client.mutate({
            query,
            variables
        });
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).send(JSON.stringify(err));
    }
});
const apollo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        case "POST":
        case "PUT":
            yield mutate(req, res);
            break;
        case "GET":
        default:
            yield query(req, res);
    }
    next();
});
exports.apollo = apollo;
