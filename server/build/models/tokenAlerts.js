"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAlerts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const tokenAlertSchema = new mongoose_2.Schema({
    tokenSymbol: {
        type: String,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true
    },
    tokenName: {
        type: String,
        required: true
    },
    subscribers: [
        {
            type: String,
            ref: 'User'
        }
    ]
});
exports.TokenAlerts = mongoose_1.default.model('TokenAlerts', tokenAlertSchema);
