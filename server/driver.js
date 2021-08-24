"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("./search");
const res = search_1.fetchSearchResults("ETH");
res
    .then(res => {
    console.log("as name: ", res.tokenRes.asName[0]);
    console.log("as address: ", res.tokenRes.asAddress[0]);
    console.log("as symbol: ", res.tokenRes.asSymbol[0]);
})
    .catch(error => {
    console.log(error);
});
