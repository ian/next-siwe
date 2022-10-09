import type { NextApiRequest, NextApiResponse } from "next"
import { generateNonce } from "siwe"

export default async function nonce(
  req: NextApiRequest,
  reply: NextApiResponse
) {
  reply.setHeader("Content-Type", "text/plain")
  reply.send(generateNonce())
}
