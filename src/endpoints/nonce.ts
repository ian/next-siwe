import { generateNonce } from "siwe"
import { EndpointParams } from "../types"

export default async function nonce(params: EndpointParams) {
  const { res } = params
  res.setHeader("Content-Type", "text/plain")
  res.send(generateNonce())
}
