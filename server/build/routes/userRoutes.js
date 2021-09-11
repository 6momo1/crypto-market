"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const users_1 = require("../models/users");
exports.userRoutes = express_1.default.Router();
/**
 * @param req GET
 * @param res returns user information of requested user
 */
exports.userRoutes.get("/", auth_1.ensureAuth, (req, res) => {
    res.json(req.user);
});
/**
 * GET: logs user out
 */
exports.userRoutes.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
    console.log("user Logged out", req.user);
});
/**
 * GET: allow admin only to get all users
 */
exports.userRoutes.get('/get_users', auth_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield users_1.User.find({});
    res.json({ data: users });
}));
