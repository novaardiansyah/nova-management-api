import mongoose from 'mongoose'

const roleAccessSchema = new mongoose.Schema({
  'roleId': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    unique: true,
    required: true
  },
  'menu': {
    type: Array,
    required: true,
    default: [],
    ref: 'Menu'
  },
  'submenu': {
    type: Array,
    required: true,
    default: [],
    ref: 'Submenu'
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

export default mongoose.model('roleAccess', roleAccessSchema)