// EXPO_PUBLIC_* values are bundled into the app. Never put secrets here.
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL ?? '',
  keycloakIssuer: process.env.EXPO_PUBLIC_KEYCLOAK_ISSUER ?? '',
  keycloakClientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
  oracleUrl: process.env.EXPO_PUBLIC_ORACLE_URL ?? '',
  authBypass: process.env.EXPO_PUBLIC_AUTH_BYPASS === 'true',
};
