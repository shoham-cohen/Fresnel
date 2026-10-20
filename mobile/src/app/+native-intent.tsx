// The Keycloak redirect (fresnel://oauth?code=...) is read by expo-auth-session. On Android it also
// reaches the router as a deep link; send it home instead of to an unmatched route.
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  return /^(fresnel:\/\/|\/)?oauth\b/.test(path) ? '/' : path;
}
