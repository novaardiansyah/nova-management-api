import m_menu from '../models/menu.js'
import h_main from '../helpers/Main.js'

export async function store(req, res) {
  try {
    const { name, link, icon, sortOrder, isActive } = req.body
    
    const menu = await m_menu.create({ name, link, icon, sortOrder, isActive, createdAt: h_main.getTimestamp(), createdBy: "63a28eadb8d57105e0f173a8" })

    let result = {
      'id': menu._id,
      'name': menu.name,
      'link': menu.link,
      'icon': menu.icon,
      'sortOrder': menu.sortOrder,
      'isActive': menu.isActive,
      'createdAt': menu.createdAt
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'Successfully save your new data.', data: { menu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store }