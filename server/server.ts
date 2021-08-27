import express from "express"
import cors from "cors"
import { fetchDataRoutes } from "./routes/fetchDataRoutes"
const app = express()

// Constants
const PORT: number = 5000

//middleware
app.use(cors());
app.use(express.json()); //req.body, allow express to read json

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Home Page" );
} );

// data fetching routes
app.use('./fetch', fetchDataRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});