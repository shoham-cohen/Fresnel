import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

/** Call once before rendering: redirects to the login page if there is no session. */
export async function initAuth(): Promise<void> {
  await keycloak.init({
    onLoad: 'login-required',
    // The authorization code in the URL is useless without the verifier, which never leaves the browser.
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });
}

/** A valid token for the next request, refreshed when less than 30 seconds remain. */
export async function authToken(): Promise<string | null> {
  try {
    await keycloak.updateToken(30);
  } catch {
    await keycloak.login();
    return null;
  }
  return keycloak.token ?? null;
}

/** The signed-in user's full name ("Dana Cohen"), or undefined before login. */
export const userName = (): string | undefined => keycloak.tokenParsed?.name as string | undefined;

export const logout = () => keycloak.logout({ redirectUri: window.location.origin });
