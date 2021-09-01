import { UniqueFragmentNamesRule } from 'graphql';
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
  googleId: string,
  displayName: string,
  firstName: string,
  lastName: string,
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
  tokenAddress: {
    type: String,
    required: true
  },
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
    default: {email: false, telegram: false},
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

export const User = mongoose.model<UserInterface>('User', userSchema);