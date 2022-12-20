import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import m_user from '../models/users.js'

export async function login(req, res) {
  try {
    const { username, password, log_id } = req.body

    const user = await m_user.findOne({ username })
    console.log(user);

    if (!user) return res.status(200).json({ status: false, message: 'Your username or password is wrong.' })

    let _password = await bcrypt.compare(password, user.password)
    if (!_password) return res.status(200).json({ status: false, message: 'Your username or password is wrong.' })

    if (!user.isActive) return res.status(200).json({ status: false, message: 'Your account is not active.' })

    if (user.isBanned) return res.status(200).json({ status: false, message: 'Your account is banned.' })

    let update = await m_user.findByIdAndUpdate(user._id, { lastOnline: Date.now(), updatedAt: Date.now(), updatedBy: log_id }, { new: true })

    let result = {
      id: user._id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      isActive: user.isActive,
      lastOnline: update.lastOnline
    }

    res.status(200).json({ status: true, message: 'Login successful.', user: result })
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export async function register(req, res) {
  const { username, password, email, roleId } = req.body

  let _password = bcrypt.hashSync(password, 10)
  const newUser = new m_user({ username, password: _password, email, roleId })

  try {
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export default { login, register }