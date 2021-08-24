import { fetchSearchResults } from "./data/search";


const res = fetchSearchResults("ETH")

res
.then( res => {
        console.log("as name: " , res.tokenRes.asName[0]);
        console.log("as address: ", res.tokenRes.asAddress[0]);
        console.log("as symbol: ",res.tokenRes.asSymbol[0]);
    }
)
.catch( error => {
    console.log(error);
})


