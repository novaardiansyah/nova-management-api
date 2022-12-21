import mongoose from 'mongoose'

const tokensSchema = new mongoose.Schema({
  'userId' : {
    type: String,
    required: true
  },
  'type': {
    type: String,
    required: true
  },
  'token': {
    type: String,
    required: true
  },
  'createdAt': {
    type: Date,
    required: true,
    default: Date.now
  },
  'expiredAt': {
    type: Date,
    required: true
  }
})

export default mongoose.model('Tokens', tokensSchema)