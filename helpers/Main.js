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

export function getTimestamp({plus = 0, minus = 0} = {}) {
  let timestamp = Date.now()

  if (plus > 0) return timestamp = timestamp + (1000 * 60 * 60 * plus)

  if (minus > 0) return timestamp = timestamp - (1000 * 60 * 60 * minus)

  return timestamp
}

export default { responseAPI, randomTokens, getTimestamp }