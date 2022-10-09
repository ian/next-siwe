import Day from "dayjs"
import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"
import { SiweMessage } from "siwe"
import { v4 as uuid } from "uuid"

export default async function verify(
  req: NextApiRequest,
  reply: NextApiResponse,
  key: string
) {
  const { message, signature } = req.body

  try {
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)
    const { address, nonce } = fields
    const sessionToken = uuid()
    const payload = {
      sessionToken,
      // nonce,
      address,
      expires: Day().add(1, "day").toISOString()
    }
    const token = jwt.sign(payload, key)

    reply.status(200).send(token)
  } catch (err) {
    console.error(err)
    reply.status(401).send("Unauthorized")
  }
}
