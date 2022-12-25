import m_roleAccess from '../models/roleAccess.js'
import h_main from '../helpers/Main.js'

export async function store(req, res) {
  try {
    const { roleId, menu, submenu, isActive } = req.body
    
    const roleAccess = await m_roleAccess.create({ roleId, menu, submenu, isActive, createdBy: "63a28eadb8d57105e0f173a8" })

    let result = {
      'id': roleAccess._id,
      'roleId': roleAccess.roleId,
      'menu': roleAccess.menu,
      'submenu': roleAccess.submenu,
      'isActive': roleAccess.isActive,
      'createdAt': roleAccess.createdAt
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'Successfully save your new data.', data: { roleAccess: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function get(req, res) {
  try {
    const { roleId } = req.body

    const roleAccess = await m_roleAccess.findOne({ roleId })

    if (!roleAccess) return h_main.responseAPI(req, res, { code: 404, message: 'Data not found.' })

    let result = {
      'id'       : roleAccess._id,
      'roleId'   : roleAccess.roleId,
      'menu'     : roleAccess.menu,
      'submenu'  : roleAccess.submenu,
      'isActive' : roleAccess.isActive,
      'createdAt': roleAccess.createdAt
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully get your data.', data: { roleAccess: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function update(req, res) {
  try {
    const { roleId, menu, submenu, isActive } = req.body

    const updateRoleAccess = await m_roleAccess.findOneAndUpdate({ roleId: roleId }, {
      'menu'    : menu,
      'submenu' : submenu
    })

    let result = {
      'id'       : updateRoleAccess._id,
      'roleId'   : updateRoleAccess.roleId,
      'menu'     : updateRoleAccess.menu,
      'submenu'  : updateRoleAccess.submenu,
      'isActive' : updateRoleAccess.isActive,
      'createdAt': updateRoleAccess.createdAt,
      'updatedAt': updateRoleAccess.updatedAt
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully update your data.', data: { roleAccess: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store, get, update }