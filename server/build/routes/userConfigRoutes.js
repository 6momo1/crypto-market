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
exports.userConfigRoutes = void 0;
const express_1 = __importDefault(require("express"));
const usersControler = __importStar(require("../controlers/userControler"));
exports.userConfigRoutes = express_1.default.Router();
// DELETE
exports.userConfigRoutes.delete("/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token);
exports.userConfigRoutes.delete("/user_remove_token_price_alert", usersControler.user_remove_token_price_alert);
exports.userConfigRoutes.delete("/user_delete/:id", usersControler.user_delete);
// PUT
exports.userConfigRoutes.put("/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token);
exports.userConfigRoutes.put("/user_edit_email", usersControler.user_edit_email);
exports.userConfigRoutes.put("/user_edit_telegram", usersControler.user_edit_telegram);
exports.userConfigRoutes.put("/user_edit_membership", usersControler.user_edit_membership);
exports.userConfigRoutes.put("/user_toggle_email", usersControler.user_toggle_email);
exports.userConfigRoutes.put("/user_toggle_telegram", usersControler.user_toggle_telegram);
