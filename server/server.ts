import express from "express"
import cors from "cors"
import { fetchDataRoutes } from "./routes/fetchDataRoutes"
import { userRoutes } from "./routes/userRoutes"
import mongoose from 'mongoose'
require('dotenv').config({path:__dirname+'/./../.env'})

// express app
const app = express()

// connect to mongo db
mongoose.connect(process.env.MONGO_URI)
  .then(result => app.listen(3000, () => {
    console.log(`Server listening on port: 3000`);
    
  }))
  .catch(err => console.log(err));


//middleware
app.use(cors());
app.use(express.json()); //req.body, allow express to read json

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Home Page" );
});

// data fetching routes
app.use('/fetch', fetchDataRoutes)
app.use('/users', userRoutes)
