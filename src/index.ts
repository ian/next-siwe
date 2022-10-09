import type { NextApiRequest, NextApiResponse } from "next"

import me from "./endpoints/me"
import nonce from "./endpoints/nonce"
import verify from "./endpoints/verify"

export function createSIWEHandler(opts) {
  const { secret } = opts

  return async function SIWE(req: NextApiRequest, reply: NextApiResponse) {
    const tokens = req.url.split("/")
    const path = tokens[tokens.length - 1]

    switch (path) {
      case "me":
        me(req, reply)
        break
      case "nonce":
        await nonce(req, reply)
        break
      case "verify":
        await verify(req, reply, secret)
        break
      default:
        reply.status(404).send("Not Found")
    }
  }
}
