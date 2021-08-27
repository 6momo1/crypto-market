import mongoose from 'mongoose'
const Schema = mongoose.Schema;

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
  tokenWatchlist: {
    tokenName: {
      priceAlerts: {
        above: [{
          type: Number,
          required: false
        }],
        below: [{
          type: Number,
          required: false
        }]
      }
    }
  }
}, { timestamps: true });

export const Client = mongoose.model('Blog', clientSchema);