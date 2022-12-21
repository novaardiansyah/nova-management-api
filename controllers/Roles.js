import m_roles from '../models/roles.js'
import h_main from '../helpers/Main.js'

export async function store(req, res) {
  try {
    const { name, isActive } = req.body

    const roles = await m_roles.create({ name, isActive, createdBy: "63a28eadb8d57105e0f173a8" })

    let result = {
      'id': roles._id,
      'name': roles.name,
      'isActive': roles.isActive,
      'createdAt': roles.createdAt
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'Successfully save your new data.', data: { roles: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store }