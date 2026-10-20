// Keycloak realm "galileo" public signing key (JWKS). Public data, safe to commit.
// Source: https://keycloak.galileo.localhost/realms/galileo/protocol/openid-connect/certs (2026-10-20)
// Replace this file only if the Keycloak team tells you the signing key was rotated.
import type { JSONWebKeySet } from 'jose';

export const KEYCLOAK_JWKS: JSONWebKeySet = {
  "keys": [
    {
      "kid": "JaYUiC0GhkbbB5wjJfVrGP9qD_usnkoReUozJv2SuRI",
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      "x5c": [
        "MIICnTCCAYUCBgGhUsFskDANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDDAdnYWxpbGVvMB4XDTI2MTAxOTA2MDExMFoXDTM2MTAxOTA2MDI1MFowEjEQMA4GA1UEAwwHZ2FsaWxlbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPSZgAtaSRGrTG1VEriH8bxrbSIagV0MRiCt9aCUfl7qdDrbCNUpD31phibsWKV+/GFrYRR2NOgEbmw4DpuAYH6MCNxMaI6X57iTHbtpfQC7ubDuQXQQKZvcY2sIHu9yH8eXKIzHrjSLkAFsxXQL5jJGgy+aJHcYVhokpiWKfGo7ec163foJbaloenCmAT7HUeO+6daZFSsg8p8ciREw0b3I5u8yutfZYaPU89pANy2jMCmw3npQ7mgQ+NEx9ltAaYmWN5t/FCMcbkt8tE9RriJXx11Hg0LdjaftsCtE0g3EjHSGt6+5tAOohxS7KeM+iDHmY8WwnuEKy5QKmFZDdLsCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAmq2QCHK/iL1aU5SxTd4muAHTjlnnaEzo/8C/Jr2KAmRrBLoG0nnLoUD2oov3RPIBXPBRWF3fBsZjm1iQhYzWeoV7zDfGJwWQ9MFrJiiqZNlU2fGxSmyLY7gUNlyS0RSmGuYsNKRj5BqOVadX3TbnVPyokjwcIV6MwkWH+XFG9VFqGNiK1tWMDLUfIbv5qpvH7RLy5WyrNgbgyb7Ws2f8iZpk2g8hrKL6OD5iQZYvLuxOxP8fDyt4LJTf+KDwpAIzd7NAJ39j8PsZM343Rg0kSSleeUQmP3ZxUsPBpPQW+cREs/Bd6K/leD0GgTenMu6/EVOQKMdk5eTjpTiVXUi/yA=="
      ],
      "x5t": "pWK-APn1_m5lvdq1DB5KeTmG7Gk",
      "x5t#S256": "pWZfls4glJM8JO0sq660LMhggSJizYwKrP0gJ8golt4",
      "n": "9JmAC1pJEatMbVUSuIfxvGttIhqBXQxGIK31oJR-Xup0OtsI1SkPfWmGJuxYpX78YWthFHY06ARubDgOm4BgfowI3ExojpfnuJMdu2l9ALu5sO5BdBApm9xjawge73Ifx5cojMeuNIuQAWzFdAvmMkaDL5okdxhWGiSmJYp8ajt5zXrd-gltqWh6cKYBPsdR477p1pkVKyDynxyJETDRvcjm7zK619lho9Tz2kA3LaMwKbDeelDuaBD40TH2W0BpiZY3m38UIxxuS3y0T1GuIlfHXUeDQt2Np-2wK0TSDcSMdIa3r7m0A6iHFLsp4z6IMeZjxbCe4QrLlAqYVkN0uw",
      "e": "AQAB"
    }
  ]
};
