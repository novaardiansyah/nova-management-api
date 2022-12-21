import m_submenu from '../models/submenu.js'
import h_main from '../helpers/Main.js'

export async function store(req, res) {
  try {
    const { menuId, name, link, sortOrder, isActive } = req.body
    
    const submenu = await m_submenu.create({ menuId, name, link, sortOrder, isActive, createdAt: h_main.getTimestamp(), createdBy: "63a28eadb8d57105e0f173a8" })

    let result = {
      'id': submenu._id,
      'menuId': submenu.menuId,
      'name': submenu.name,
      'link': submenu.link,
      'icon': submenu.icon,
      'sortOrder': submenu.sortOrder,
      'isActive': submenu.isActive,
      'createdAt': submenu.createdAt
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'Successfully save your new data.', data: { submenu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store }