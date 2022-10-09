import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

export default function me(req: NextApiRequest, reply: NextApiResponse) {
  const [_, token] = req.headers.authorization.split(" ")
  try {
    const decoded = jwt.decode(token, { complete: true })
    const { address, expires } = decoded.payload
    reply.status(200).send({ address, expires })
  } catch (err) {
    console.error(err)
    reply.status(401).send({ error: "Unauthorized" })
  }
}
