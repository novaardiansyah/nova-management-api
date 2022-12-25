import mongoose from 'mongoose'

const submenuSchema = new mongoose.Schema({
  'menuId' : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  'name' : {
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

export default mongoose.model('Submenu', submenuSchema)