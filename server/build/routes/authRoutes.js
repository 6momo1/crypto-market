"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
exports.authRoutes = express_1.default.Router();
const errorLoginUrl = 'http://localhost:3000/error';
const successLoginUrl = 'http://localhost:3000/login/success';
// @desc Auth with Google
// @route GET /auth/google
exports.authRoutes.get("/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
// @desc Auth callback
// @route GET /auth/google/callback
exports.authRoutes.get("/google/callback", passport_1.default.authenticate('google', {
    failureMessage: "Cannot login to Google.",
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
}), (req, res) => {
    res.json({ user: req.user });
    console.log("User: ", req.user);
});
