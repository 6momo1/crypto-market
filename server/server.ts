import express from "express"
import {apollo} from "./apollo"

const app = express();
const port = 3000;

app.use(express.json());
app.use(apollo);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));