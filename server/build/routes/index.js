"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authRoutes_1 = require("./authRoutes");
const fetchDataRoutes_1 = require("./fetchDataRoutes");
const userConfigRoutes_1 = require("./userConfigRoutes");
const userRoutes_1 = require("./userRoutes");
const alertSubscriberRoutes_1 = require("./alertSubscriberRoutes");
exports.router = express_1.default.Router();
exports.router.get("/", (req, res) => {
    res.json({ "message": "crypto-watch API" });
});
exports.router.use('/auth', authRoutes_1.authRoutes);
exports.router.use('/fetch', fetchDataRoutes_1.fetchDataRoutes);
exports.router.use('/user', userRoutes_1.userRoutes);
exports.router.use('/user_settings', userConfigRoutes_1.userConfigRoutes);
exports.router.use('/price_alert', alertSubscriberRoutes_1.alertSubscriberRoutes);
