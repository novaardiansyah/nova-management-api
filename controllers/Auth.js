import bcrypt from 'bcryptjs'

import m_user from '../models/users.js'
import m_token from '../models/tokens.js'
import h_main from '../helpers/Main.js'

export async function login(req, res) {
  try {
    const { username, password, log_id } = req.body

    // * Validate username and password
    const user = await m_user.findOne({ username })

    if (!user) return h_main.responseAPI(req, res, { code: 400, message: 'Your username or password is wrong.' })

    let _password = await bcrypt.compare(password, user.password)
    if (!_password) return h_main.responseAPI(req, res, { code: 400, message: 'Your username or password is wrong.' })

    if (user.isBanned) return h_main.responseAPI(req, res, { code: 400, message: 'Your account has been suspended, if this is an error, contact our cs support.' })

    // * Generate token
    await m_token.deleteMany({ userId: user._id, type: 'auth-login' })

    let token = h_main.randomTokens(256)

    let tokenData = {
      userId: user._id,
      type: 'auth-login',
      token: token,
      expiredAt: h_main.getTimestamp({ plus: 24 * 7 })
    }

    let tokenSave = await m_token.create(tokenData)

    // * Update user
    let update = await m_user.findByIdAndUpdate(user._id, { lastOnline: Date.now(), updatedAt: Date.now(), updatedBy: log_id, token: { 'auth-login': token } }, { new: true })

    // * Set Response
    let result = {
      id: user._id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      isActive: user.isActive,
      lastOnline: update.lastOnline
    }

    let r_token = {
      name: 'auth-login',
      value: token,
      expiredAt: tokenSave.expiredAt
    }

    return h_main.responseAPI(req, res, { code: 200, message: 'You have successfully logged in, please wait a moment.', data: { user: result, token: r_token } })
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

    // * Generate token
    await m_token.deleteMany({ userId: newUser._id, type: 'auth-login' })

    let token = h_main.randomTokens(256)

    let tokenData = {
      userId: newUser._id,
      type: 'auth-login',
      token: token,
      expiredAt: h_main.getTimestamp({ plus: 24 * 7 })
    }

    let tokenSave = await m_token.create(tokenData)

    // * Update user
    let update = await m_user.findByIdAndUpdate(newUser._id, { lastOnline: Date.now(), updatedAt: Date.now(), updatedBy: newUser._id }, { new: true })

    // * Set Response
    let result = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      roleId: newUser.roleId,
      isActive: newUser.isActive,
      lastOnline: update.lastOnline
    }

    let r_token = {
      name: 'auth-login',
      value: token,
      expiredAt: tokenSave.expiredAt
    }

    return h_main.responseAPI(req, res, { code: 201, message: 'You have successfully registered, please wait a moment.', data: { user: result, token: r_token } })
  } catch (error) {
    return h_main.responseAPI(req, res, { code: 400, message: error.message })
  }
}

export default { login, register }