import mongoose from 'mongoose'

const menuSchema = new mongoose.Schema({
  'name' : {
    type: String,
    required: true
  },
  'icon': {
    type: String,
    required: true
  },
  'link': {
    type: String,
    required: true
  },
  'sortOrder': {
    type: Number,
    required: true,
    default: 0
  },
  'isActive': {
    type: Boolean,
    required: true,
    default: true
  },
  'isDeleted': {
    type: Boolean,
    required: true,
    default: false
  },
  'createdBy': {
    type: String,
    required: false,
    default: null
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

export default mongoose.model('Menu', menuSchema)