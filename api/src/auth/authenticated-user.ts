/** The signed-in user, taken from the verified Keycloak token and set on `request.user`. */
export interface AuthenticatedUser {
  id: string;
  name?: string;
  roles: string[];
}
