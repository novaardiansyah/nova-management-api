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

export default { store }