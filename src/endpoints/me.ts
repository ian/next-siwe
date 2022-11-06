import jwt from "jsonwebtoken"
import { EndpointParams } from "../types"

export default async function me(params: EndpointParams) {
  const { req, res, opts } = params
  const [_, token] = req.headers.authorization.split(" ")
  try {
    const decoded = jwt.decode(token, { complete: true })
    const { address, expires } = decoded.payload
    const session = (await opts.session?.(address)) || {}
    res.status(200).send({ address, expires, session })
  } catch (err) {
    console.error(err)
    res.status(401).send({ error: "Unauthorized" })
  }
}
