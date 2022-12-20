import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  'username': {
    type: String,
    required: true
  },
  'password': {
    type: String,
    required: true
  },
  'email': {
    type: String,
    required: true
  },
  'roleId': {
    type: String,
    required: false,
    default: 'customer'
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
  'isDeleted': {
    type: Boolean,
    required: true,
    default: false
  },
  'createdBy': {
    type: String,
    required: false,
    default: "001"
  },
  'updatedBy': {
    type: String,
    required: false,
    default: null
  },
  'deletedBy': {
    type: String,
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