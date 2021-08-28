import mongoose from 'mongoose'
import { Document, Schema } from 'mongoose'

export interface TokenWatchlistInterface {
  tokenSymbol: string,
  tokenAddress: string,
  priceAlerts: {
    above?: number[],
    below?: number[]
  }
}

export interface UserInterface extends Document {
  name: string,
  notifyBy: {
    email: string,
    telegram: string
  },
  email: string,
  telegram: string,
  tokenWatchlist: TokenWatchlistInterface[],
  member: boolean
}

const tokenWatchlistSchema = new Schema({

    tokenSymbol: {
      type: String,
      required: true
    },
    member: {
      type:Boolean,
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
})

const userSchema = new Schema({
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

export const User = mongoose.model<UserInterface>('User', userSchema);