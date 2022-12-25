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

export async function getAllowAccessMenu(req, res) {
  try {
    const { ids } = req.body

    const menu = await m_menu.find({ _id: { $in: ids } })
    menu.sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1)
    
    let result = []
    menu.forEach((item) => {
      result.push({
        'id'       : item._id,
        'name'     : item.name,
        'link'     : item.link,
        'icon'     : item.icon,
        'sortOrder': item.sortOrder,
        'isParent' : item.isParent,
        'isActive' : item.isActive,
        'createdAt': item.createdAt
      })
    })

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully get your data.', data: { menu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function getAll(req, res) {
  try {
    let result = []
    const menu = await m_menu.find()

    if (menu) {
      menu.sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1)

      menu.forEach((item) => {
        result.push({
          'id': item._id,
          'name': item.name,
          'link': item.link,
          'icon': item.icon,
          'sortOrder': item.sortOrder,
          'isActive': item.isActive,
          'createdAt': item.createdAt
        })
      })
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully get your data.', data: { menu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function update(req, res) {
  try {
    const { id, name, link, icon, sortOrder, isParent, isActive } = req.body

    const menu = await m_menu.findOneAndUpdate({ _id: id }, { name, link, icon, sortOrder, isParent, isActive, updatedAt: h_main.getTimestamp(), updatedBy: process.env.SUPERADMIN_ID }, { new: true })

    let result = {
      'id'       : menu._id,
      'name'     : menu.name,
      'link'     : menu.link,
      'icon'     : menu.icon,
      'sortOrder': menu.sortOrder,
      'isParent' : menu.isParent,
      'isActive' : menu.isActive,
      'createdAt': menu.createdAt,
      'updatedAt': menu.updatedAt
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Successfully update your data.', data: { menu: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { store, getAllowAccessMenu, getAll, update }