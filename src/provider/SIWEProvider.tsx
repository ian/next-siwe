import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"
import { useAccount, useSigner } from "wagmi"

import { createSiweMessage } from "../client"
import { useToken } from "../utils/token"

const Context = createContext({
  isLoading: true,
  isAuthenticated: false,
  address: null,
  login: async () => {},
  logout: () => {}
})

export type UseSIWE = {
  isLoading: boolean
  isAuthenticated: boolean
  address?: string
  token?: string
  login: () => Promise<void>
  logout: any
}

export function useSIWE(): UseSIWE {
  return useContext(Context)
}

type Auth = {
  address: string
}

type Props = {
  text?: string
  uri?: string
  children: any
  onToken?: (string) => void
}

export const SIWEProvider = ({
  text = "Sign in with Ethereum to the app.",
  uri = "/api/siwe",
  children,
  onToken
}: Props) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const [isLoading, setLoading] = useState(true)
  const [token, setToken] = useToken()
  const [auth, setAuth] = useState<Auth>()

  const login = async () => {
    setLoading(true)
    const message = createSiweMessage(address, text)

    return signer
      .signMessage(message)
      .then((signature) =>
        fetch(`${uri}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message, signature }),
          credentials: "include"
        })
      )
      .then((res) => res.text())
      .then((token) => {
        setToken(token)
      })
  }

  const logout = useCallback(() => {
    setToken("")
    setAuth(undefined)
  }, [setToken])

  useEffect(() => {
    if (token && token !== "") {
      fetch(`${uri}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) {
            setAuth(res)
          }
        })
        .then(() => onToken?.(token))
        .finally(() => setLoading(false))
    } else {
      setAuth(undefined)
      setLoading(false)
      onToken?.(undefined)
    }
  }, [token, uri, onToken])

  useEffect(() => {
    if (!address) logout()
  }, [address, logout])

  const value = {
    isLoading,
    isAuthenticated: !!token,
    address: auth?.address,
    token,
    login,
    logout
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
