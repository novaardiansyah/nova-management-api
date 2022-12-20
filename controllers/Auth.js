import bcrypt from 'bcryptjs'

import m_user from '../models/users.js'
import h_main from '../helpers/Main.js'

export async function login(req, res) {
  try {
    const { username, password, log_id } = req.body

    const user = await m_user.findOne({ username })

    if (!user) return h_main.responseAPI(req, res, { code: 400, message: 'Your username or password is wrong.' })

    let _password = await bcrypt.compare(password, user.password)
    if (!_password) return h_main.responseAPI(req, res, { code: 400, message: 'Your username or password is wrong.' })

    if (!user.isActive) return h_main.responseAPI(req, res, { code: 400, message: 'Your account is not active.' })

    if (user.isBanned) return h_main.responseAPI(req, res, { code: 400, message: 'Your account is banned.' })

    let token = h_main.randomTokens(256)

    let update = await m_user.findByIdAndUpdate(user._id, { lastOnline: Date.now(), updatedAt: Date.now(), updatedBy: log_id, token: { 'auth-login': token } }, { new: true })

    let result = {
      id: user._id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      isActive: user.isActive,
      lastOnline: update.lastOnline,
      token
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'Login successful.', data: { user: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export async function register(req, res) {
  const { username, password, email } = req.body

  let _password = bcrypt.hashSync(password, 10)
  const newUser = new m_user({ username, password: _password, email })

  try {
    await newUser.save()

    let token = h_main.randomTokens(256)

    let update = await m_user.findByIdAndUpdate(newUser._id, { lastOnline: Date.now(), updatedAt: Date.now(), updatedBy: newUser._id, token: { 'auth-login': token } }, { new: true })

    let result = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      roleId: newUser.roleId,
      isActive: newUser.isActive,
      lastOnline: update.lastOnline,
      token
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'Register successful.', data: { user: result } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { login, register }