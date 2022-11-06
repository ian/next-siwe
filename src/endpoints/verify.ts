import Day from "dayjs"
import jwt from "jsonwebtoken"
import { SiweMessage } from "siwe"
import { v4 as uuid } from "uuid"
import { EndpointParams } from "../types"

export default async function verify(params: EndpointParams) {
  const { req, res, opts } = params
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
    const token = jwt.sign(payload, opts.secret)

    res.status(200).send(token)
  } catch (err) {
    console.error(err)
    res.status(401).send("Unauthorized")
  }
}
