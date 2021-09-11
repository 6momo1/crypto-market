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
    googleId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    notifyBy: {
        type: {
            email: {
                type: Boolean,
                default: false
            },
            telegram: {
                type: Boolean,
                default: false
            }
        },
        required: true,
        default: { email: false, telegram: false },
    },
    email: {
        type: String,
        default: ""
    },
    telegram: {
        type: String,
        default: ""
    },
    tokenWatchlist: [tokenWatchlistSchema],
    member: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
