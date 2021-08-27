"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const tokenWatchlistSchema = new Schema({
    tokenSymbol: {
        type: String,
        required: true
    },
    priceAlerts: [{
            above: [{
                    type: Number,
                    required: false
                }],
            below: [{
                    type: Number,
                    required: false
                }]
        }]
});
const clientSchema = new Schema({
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
    tokenWatchlist: [tokenWatchlistSchema]
}, { timestamps: true });
exports.Client = mongoose_1.default.model('Client', clientSchema);
