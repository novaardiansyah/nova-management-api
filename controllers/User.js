import m_user from '../models/users.js'

export async function get(req, res) {
  try {
    const users = await m_user.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export default { get }