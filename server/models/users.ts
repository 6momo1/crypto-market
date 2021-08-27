import mongoose from 'mongoose'
const Schema = mongoose.Schema;

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
})

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

export const Client = mongoose.model('Client', clientSchema);