import cryptoRandomString from 'crypto-random-string'

export async function responseAPI(req, res, params = {}) {
  const { csrf_renewed } = req.body
  const { code, message, data } = params

  if (code == 200)
  {
    return res.status(200).json({ status: true, message, data: {csrf_renewed, ...data} })
  }

  if (code == 201)
  {
    return res.status(201).json({ status: true, message, data: {csrf_renewed, ...data} })
  }

  if (code == 400)
  {
    return res.status(400).json({ status: false, message, data: {csrf_renewed, ...data} })
  }

  return res.status(401).json({ status: false, message, data: {csrf_renewed, ...data} })
}

export function randomTokens(length = 32, type = 'base64') {
  if (length < 32) length = 32

  return cryptoRandomString({length, type})
}

export default { responseAPI, randomTokens }