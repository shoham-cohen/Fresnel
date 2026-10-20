import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

// Called once in main.tsx before rendering: redirects to the Keycloak login page if needed.
export async function initAuth(): Promise<void> {
  await keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })
}

// A valid token for the next request, refreshed when less than 30 seconds are left.
export async function authToken(): Promise<string | null> {
  try {
    await keycloak.updateToken(30)
  } catch {
    await keycloak.login()
    return null
  }
  return keycloak.token ?? null
}

export type CurrentUser = {
  id: string
  username: string
  fullName: string
  roles: string[]
}

export function currentUser(): CurrentUser {
  const token = keycloak.tokenParsed
  return {
    id: token?.sub ?? '',
    username: token?.preferred_username ?? '',
    fullName: token?.name ?? '',
    roles: keycloak.resourceAccess?.[import.meta.env.VITE_KEYCLOAK_CLIENT_ID]?.roles ?? [],
  }
}

export const hasRole = (role: string) => keycloak.hasResourceRole(role)

export const logout = () => keycloak.logout({ redirectUri: window.location.origin })
