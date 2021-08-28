"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const usersControler = __importStar(require("../controlers/userControler"));
exports.userRoutes = express_1.default.Router();
exports.userRoutes.post("/user_create", usersControler.user_create);
exports.userRoutes.post("/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token);
exports.userRoutes.delete("/user_delete/:id", usersControler.user_delete);
exports.userRoutes.delete("/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token);
exports.userRoutes.delete("/user_remove_token_price_alert", usersControler.user_remove_token_price_alert);
exports.userRoutes.post("/user_edit_email", usersControler.user_edit_email);
exports.userRoutes.post("/user_edit_telegram", usersControler.user_edit_telegram);
exports.userRoutes.post("/testEndpoint", usersControler.testEndpoint);
