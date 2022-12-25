import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  'username': {
    type: String,
    required: true,
    unique: true
  },
  'password': {
    type: String,
    required: true
  },
  'email': {
    type: String,
    required: true,
    unique: true
  },
  'roleId': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roles',
    required: false,
    default: '63a2c29c9c2d2a1ba407137b' // * Customer
  },
  'lastOnline': {
    type: Date,
    required: true,
    default: Date.now
  },
  'activatedAt': {
    type: Date,
    required: false,
    default: null
  },
  'isActive': {
    type: Boolean,
    required: true,
    default: false
  },
  'isBanned': {
    type: Boolean,
    required: true,
    default: false
  },
  'createdBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  'updatedBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  'deletedBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  'createdAt': {
    type: Date,
    required: true,
    default: Date.now
  },
  'updatedAt': {
    type: Date,
    required: false,
    default: null
  },
  'deletedAt': {
    type: Date,
    required: false,
    default: null
  }
})

export default mongoose.model('Users', usersSchema)