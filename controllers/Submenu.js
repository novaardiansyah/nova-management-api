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

export async function getAllowAccessSubmenu(req, res) {
  try {
    const { ids } = req.body
    
    const submenu = await m_submenu.find({ _id: { $in: ids } })
    submenu.sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1)

    let result = []
    submenu.forEach((item) => {
      result.push({
        'id': item._id,
        'menuId': item.menuId,
        'name': item.name,
        'link': item.link,
        'icon': item.icon,
        'sortOrder': item.sortOrder,
        'isActive': item.isActive,
        'createdAt': item.createdAt
      })
    })

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully get your data.', data: { submenu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function update(req, res) {
  try {
    const { id, menuId, name, link, sortOrder, isActive } = req.body

    const submenu = await m_submenu.findOneAndUpdate({ _id: id }, { menuId, name, link, sortOrder, isActive, updatedAt: h_main.getTimestamp(), updatedBy: process.env.SUPERADMIN_ID }, { new: true })

    let result = {
      'id': submenu._id,
      'menuId': submenu.menuId,
      'name': submenu.name,
      'link': submenu.link,
      'icon': submenu.icon,
      'sortOrder': submenu.sortOrder,
      'isActive': submenu.isActive,
      'createdAt': submenu.createdAt,
      'updatedAt': submenu.updatedAt
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully update your data.', data: { submenu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store, getAllowAccessSubmenu, update }