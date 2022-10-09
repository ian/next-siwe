import jwt from "jsonwebtoken"

export async function decode(token: string) {
  const decoded = jwt.decode(token, { complete: true })
  return decoded.payload
}
