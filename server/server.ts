import express from "express";
import cors from "cors";
import { fetchDataRoutes } from "./routes/fetchDataRoutes";
import { userRoutes } from "./routes/userConfigRoutes";
import mongoose from "mongoose";
import { authRoutes } from "./routes/authRoutes";
import passport from "passport";
import { ensureGuest, ensureAuth } from './middleware/auth'
import session from "express-session";

// load dotenv variables
require("dotenv").config({ path: __dirname + "/./../.env" });

// Passport config
require("./config/passport")(passport);

// store session in database
const MongoStore = require('connect-mongo')

// express app
const app = express();

// connect to mongo db
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) =>
    app.listen(3000, () => {
      console.log(`Server listening on port: 3000`);
    })
  )
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUnitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
  })
);

// cors middleware
app.use(cors());
app.use(express.json()); //req.body, allow express to read json

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// define a route handler for the default home page
app.get("/",ensureGuest, (req, res) => {
  res.send(`
    HomePage
    <a href='http://localhost:3000/auth/google'>Login with google</a>
  `);
});


app.get("/dashboard", ensureAuth, (req, res) => {
  console.log(req.user);
  res.send(`
    Dashboard
    <a href='http://localhost:3000/logout'>Logout</a>
  `).json(req.user)
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// routes
app.use("/fetch", fetchDataRoutes);
app.use("/userConfig", userRoutes);
app.use("/auth", authRoutes);
