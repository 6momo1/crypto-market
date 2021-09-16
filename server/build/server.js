"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
// import { ensureGuest, ensureAuth } from './middleware/auth'
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = require("./routes");
require('dotenv').config({ path: __dirname + '/./../.env' });
require("./config/passport")(passport_1.default);
const MongoStore = require('connect-mongo');
// express app
const app = express_1.default();
const PORT = process.env.PORT || 5000;
// connect to mongo db
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then((result) => app.listen(5000, () => {
    console.log(`Server listening on port: ${PORT}`);
    // console.log("process.env", process.env)
}))
    .catch((err) => console.log(err));
// user session
app.use(express_session_1.default({
    secret: "keyboard cat",
    resave: false,
    saveUnitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
// cors middleware
app.use(cors_1.default({ origin: process.env.REACT_APP_CLIENT_DOMAIN, credentials: true }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// CRON JOBS:
// listen to price changes for all tokens
// cron.schedule('*/5 * * * * *', async () => {
//   const currentEthPrice = await fetchEthPrice()
//   console.log("\n\nrunning cron job")
//   await detectPriceChangesForAllTokens(currentEthPrice)
// });
// drop sessions every hour
// cron.schedule('* * */1 * *', async () => {
//   try {
//   } catch (error) {
//     console.log("could not delete collections from `session`.")
//   }
// });
app.get('/', (req, res) => {
    res.send("Crypto Watch API");
});
app.use('/api', routes_1.router);
