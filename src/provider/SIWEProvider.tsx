import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"
import { useAccount, useSigner } from "wagmi"

import { createSiweMessage } from "../utils/message"
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
  session?: Session
  token?: string
  login: () => Promise<void>
  logout: any
}

export function useSIWE(): UseSIWE {
  return useContext(Context)
}

type Auth = {
  address: string
  session: Session
}

// Eventually I want to convert this to a generic
type Session = object

type SIWEProviderProps = {
  text?: string
  uri?: string
  children: any
  onToken?: (string) => void
  staySignedInOnWalletChange?: boolean
}

export const SIWEProvider = ({
  text = "Sign in with Ethereum to the app.",
  uri = "/api/siwe",
  staySignedInOnWalletChange = false,
  children,
  onToken
}: SIWEProviderProps) => {
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
            // Ensure object gets rewritten
            setAuth({ ...res })
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

  useEffect(() => {
    // If wallet changes, lets log them out unless they request not to.
    if (
      address &&
      auth &&
      address != auth?.address &&
      !staySignedInOnWalletChange
    )
      logout()
  }, [address, auth])

  const value = {
    isLoading,
    isAuthenticated: !!token,
    address: auth?.address,
    session: auth?.session,
    token,
    login,
    logout
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
