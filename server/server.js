"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_1 = require("./apollo");
const app = express_1.default();
const port = 3000;
app.use(express_1.default.json());
app.use(apollo_1.apollo);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
