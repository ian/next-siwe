import jwt from "jsonwebtoken"

export default async function decode(token: string) {
  const decoded = jwt.decode(token, { complete: true })
  return decoded.payload
}
