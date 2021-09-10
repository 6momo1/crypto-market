# About
This web application allows users to track and analyze token data from decentralized exchanges such as uniswap and pancake swap. 

### Client-Side
Users can set price alerts for when a token price reaches below or above a certain price target. The webpage displays a token's price history, transaction history, and general information about the
token.

### Server-Side
The server database holds information about each user's token watchlist, their price targets, personal information and contact information.

The server will fetch token price datas via socket connection and alert users when price targets are met via email or telegram.


### future implementation
Develop an ERC-20 Token contract as a payment for CRYPTO-WATCH membership services.
create a token analytics service such as:
  Detect
    - momentum change
    - trend detection
    - social media presence
  ...
"Hot Tokens" featured
News aggregation
collect historical data, offer it as service


### Docker
run `docker-compose up -d --build` to run the app
`docker-compose down` to terminate the app

###### How Docker builds the Server
`./server/build` is a directory that consists of `.js` files compiled from the Typscript in the `./server` directory.

NOTE:  Changes made to the source files must be first compiled to Javascript files, then rebuild the docker image.
with `npx tsc --watch`, Typescript will automatically generate and compile `.js` files to the `./server/build` folder. 

Docker will copy the `./server/build` folder to the docker image, `cd` into `/build`, run npm install, then run `node server.js`