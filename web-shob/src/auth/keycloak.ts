import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

const TOKEN_MIN_VALIDITY_SECONDS = 30;

export const initAuth = async (): Promise<void> => {
  await keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });
};

export const authToken = async (): Promise<string | null> => {
  try {
    await keycloak.updateToken(TOKEN_MIN_VALIDITY_SECONDS);
  } catch {
    await keycloak.login();
    return null;
  }
  return keycloak.token ?? null;
};

export const userName = (): string | undefined => keycloak.tokenParsed?.name as string | undefined;

export const login = () => keycloak.login();

export const logout = () => keycloak.logout({ redirectUri: window.location.origin });
