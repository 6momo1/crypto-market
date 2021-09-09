import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
// import { ensureGuest, ensureAuth } from './middleware/auth'
import session from "express-session";
import { router } from "./routes";
import cron from 'node-cron'
import {fetchEthPrice} from './data/tokens/fetchEthPrices'
import {detectPriceChangesForAllTokens} from './cron-jobs/sendPriceAlerts'

require('dotenv').config({path:__dirname+'/./../.env'});
require("./config/passport")(passport);
const MongoStore = require('connect-mongo')

// express app
const app = express();
const PORT = process.env.PORT || 5000

// connect to mongo db
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) =>
    app.listen(5000, () => {
      console.log(`Server listening on port: ${PORT}`);
    })
  )
  .catch((err) => console.log(err));

// user session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUnitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
  })
);

// cors middleware
app.use(cors({origin: process.env.REACT_APP_CLIENT_DOMAIN, credentials: true}));
app.use(express.json()); 
app.use(passport.initialize());
app.use(passport.session());


// CRON JOBS:

// listen to price changes for all tokens
// cron.schedule('*/5 * * * * *', async () => {
//   const currentEthPrice = await fetchEthPrice()
//   console.log("\n\nrunning cron job")
//   await detectPriceChangesForAllTokens(currentEthPrice)
// });

// drop sessions every hour
cron.schedule('* */1 * * *', async () => {
  mongoose.connection.db.dropCollection('sessions')
});

app.get('/', (req, res) => {
  res.send("Crypto Watch API")
})

app.use('/api',router);
