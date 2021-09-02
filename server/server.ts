import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { ensureGuest, ensureAuth } from './middleware/auth'
import session from "express-session";
import { router } from "./routes";

require("dotenv").config({ path: __dirname + "/./../.env" });
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
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json()); 
app.use(passport.initialize());
app.use(passport.session());

// define a route handler for the default home page
// app.get("/",ensureGuest, (req, res) => {
//   res.json({"message":"crypto-watch API"})
// });

// app.get("/dashboard", ensureAuth, (req, res) => {
//   console.log("new User Login");
//   res.json(req.user)
// })


app.get("/", (req, res) => {
  res.json({"message":"crypto-watch API"})
});

app.get('/logout', (req, res) => {
  req.logout()
})

// routes
app.use('/api',router);
