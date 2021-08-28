"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const tokenWatchlistSchema = new mongoose_2.Schema({
    tokenAddress: {
        type: String,
        required: true
    },
    tokenSymbol: {
        type: String,
        required: true
    },
    member: {
        type: Boolean,
        required: false
    },
    priceAlerts: {
        above: [{
                type: Number,
                required: false
            }],
        below: [{
                type: Number,
                required: false
            }]
    },
});
const userSchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: true,
    },
    notifyBy: {
        type: {
            email: {
                type: Boolean,
                required: true
            },
            telegram: {
                type: Boolean,
                required: false
            }
        },
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    telegram: {
        type: String,
        required: true
    },
    tokenWatchlist: [tokenWatchlistSchema],
    member: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
