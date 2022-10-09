import { SiweMessage } from "siwe"

export function createSiweMessage(address, statement) {
  const domain = window.location.host
  const origin = window.location.origin

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1
  })

  return message.prepareMessage()
}
