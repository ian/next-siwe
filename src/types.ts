import type { NextApiRequest, NextApiResponse } from "next"

export type EndpointParams = {
  req: NextApiRequest
  res: NextApiResponse
  opts: SIWEOpts
}

export type SIWEOpts = {
  secret: string
  session?: (address) => object | Promise<object>
}
