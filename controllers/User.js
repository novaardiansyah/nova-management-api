import mongoose from 'mongoose'
import m_user from '../models/users.js'

export async function get(req, res) {
  try {
    const users = await m_user.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export async function getId(req, res) {
  const { id } = req.params

  try {
    const user = await m_user
      .findById(id)

    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export async function post(req, res) {
  const user = req.body
  const newUser = new m_user(user)

  try {
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export async function patch(req, res) {
  const { id: _id } = req.params
  const user = req.body

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that id')

  const updatedUser = await m_user.findByIdAndUpdate(_id, { ...user, _id }, { new: true })
  res.json(updatedUser)
}

export async function deleted(req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with that id')

  await Users.findByIdAndRemove(id)
  res.json({ message: 'User deleted successfully' })
}

export default { get, getId, post, patch, deleted }