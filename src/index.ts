import type { NextApiRequest, NextApiResponse } from "next"

import me from "./endpoints/me"
import nonce from "./endpoints/nonce"
import verify from "./endpoints/verify"
import { SIWEOpts } from "./types"

export { decode } from "./utils/decode"
export { getToken } from "./utils/token"
export { useSIWE, SIWEProvider } from "./provider/SIWEProvider"

export * from "./types"

export function nextSIWE(opts: SIWEOpts) {
  return async function SIWE(req: NextApiRequest, res: NextApiResponse) {
    const tokens = req.url.split("/")
    const path = tokens[tokens.length - 1]

    switch (path) {
      case "me":
        await me({ req, res, opts })
        break
      case "nonce":
        await nonce({ req, res, opts })
        break
      case "verify":
        await verify({ req, res, opts })
        break
      default:
        res.status(404).send("Not Found")
    }
  }
}
