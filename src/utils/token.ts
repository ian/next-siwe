import useReactCookie, { getCookie } from "react-use-cookie"
const KEY = "__siwe_token"

export function getToken() {
  return getCookie(KEY)
}

export function useCookie() {
  return useReactCookie(KEY)
}
