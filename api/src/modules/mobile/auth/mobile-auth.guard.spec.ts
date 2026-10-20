import { ExecutionContext, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTPayload, type KeyLike } from 'jose';
import { Arena } from '../../../entities';
import { compartmentsToArenas } from './auth-user';
import { AuthenticatedRequest, DEV_USER, MobileAuthGuard } from './mobile-auth.guard';
import { MobileTokenVerifier } from './mobile-token.verifier';

const ISSUER = 'https://keycloak.test/realms/galileo';
const CLIENT_ID = 'fresnel-mobile';

describe('MobileAuthGuard', () => {
  let privateKey: KeyLike;
  let otherPrivateKey: KeyLike;
  let verifier: MobileTokenVerifier;

  beforeAll(async () => {
    const pair = await generateKeyPair('RS256');
    privateKey = pair.privateKey;
    otherPrivateKey = (await generateKeyPair('RS256')).privateKey;
    const jwk = { ...(await exportJWK(pair.publicKey)), kid: 'k1', alg: 'RS256' };
    verifier = new MobileTokenVerifier({
      issuer: ISSUER,
      clientId: CLIENT_ID,
      keys: createLocalJWKSet({ keys: [jwk] }),
    });
  });

  function sign(claims: JWTPayload, options: { key?: KeyLike; issuer?: string; expiresIn?: string } = {}) {
    return new SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setIssuer(options.issuer ?? ISSUER)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? '5m')
      .sign(options.key ?? privateKey);
  }

  const validClaims = {
    sub: '6f1c9a2e-3b7d-4e8f-a0c1-5d2e9b8f7a63',
    azp: CLIENT_ID,
    aud: CLIENT_ID,
    preferred_username: 'dana.cohen',
    name: 'Dana Cohen',
    compartment: ['israel', 'arabic'],
    resource_access: { [CLIENT_ID]: { roles: ['editor'] }, mirage: { roles: ['admin'] } },
  };

  function guardWith(env: Record<string, string> = {}, customVerifier = verifier) {
    return new MobileAuthGuard(customVerifier, new ConfigService(env));
  }

  function contextFor(authorization?: string) {
    const request = { headers: authorization ? { authorization } : {} } as AuthenticatedRequest;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    return { request, context };
  }

  it('puts the user from a valid token on the request', async () => {
    const { request, context } = contextFor(`Bearer ${await sign(validClaims)}`);

    await expect(guardWith().canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({
      id: validClaims.sub,
      username: 'dana.cohen',
      name: 'Dana Cohen',
      arenas: [Arena.IL, Arena.ARAB],
      roles: ['editor'],
    });
  });

  it('accepts a token whose aud is another client when azp is the mobile client', async () => {
    const { context } = contextFor(`Bearer ${await sign({ ...validClaims, aud: 'account' })}`);
    await expect(guardWith().canActivate(context)).resolves.toBe(true);
  });

  it.each([
    ['no token', undefined],
    ['a malformed header', 'Token abc'],
    ['garbage', 'Bearer not.a.jwt'],
  ])('rejects %s with 401', async (_name, header) => {
    const { context } = contextFor(header);
    await expect(guardWith().canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a token signed by another key', async () => {
    const { context } = contextFor(`Bearer ${await sign(validClaims, { key: otherPrivateKey })}`);
    await expect(guardWith().canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an expired token', async () => {
    const token = await new SignJWT(validClaims)
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setIssuer(ISSUER)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 300)
      .sign(privateKey);
    const { context } = contextFor(`Bearer ${token}`);
    await expect(guardWith().canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a token from another issuer', async () => {
    const { context } = contextFor(`Bearer ${await sign(validClaims, { issuer: 'https://evil.test/realms/x' })}`);
    await expect(guardWith().canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a token issued to another client (e.g. the web)', async () => {
    const token = await sign({ ...validClaims, azp: 'fresnel-web', aud: 'fresnel-web' });
    const { context } = contextFor(`Bearer ${token}`);
    await expect(guardWith().canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('answers 503 when the signing keys cannot be fetched', async () => {
    const unreachable = new MobileTokenVerifier({
      issuer: ISSUER,
      clientId: CLIENT_ID,
      keys: () => Promise.reject(new Error('getaddrinfo ENOTFOUND keycloak.test')),
    });
    const { context } = contextFor(`Bearer ${await sign(validClaims)}`);
    await expect(guardWith({}, unreachable).canActivate(context)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('uses the dev user without a token when MOBILE_AUTH_BYPASS=true', async () => {
    const { request, context } = contextFor();
    await expect(guardWith({ MOBILE_AUTH_BYPASS: 'true' }).canActivate(context)).resolves.toBe(true);
    expect(request.user).toBe(DEV_USER);
  });

  it('still verifies a token sent while MOBILE_AUTH_BYPASS=true', async () => {
    const { context } = contextFor('Bearer not.a.jwt');
    await expect(guardWith({ MOBILE_AUTH_BYPASS: 'true' }).canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('ignores MOBILE_AUTH_BYPASS in production', async () => {
    const { context } = contextFor();
    const guard = guardWith({ MOBILE_AUTH_BYPASS: 'true', NODE_ENV: 'production' });
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

describe('compartmentsToArenas', () => {
  it('maps Keycloak compartments to arenas, dropping unknown values and duplicates', () => {
    expect(compartmentsToArenas(['israel', 'arabic', 'arab', 'mars'])).toEqual([Arena.IL, Arena.ARAB]);
    expect(compartmentsToArenas('israel')).toEqual([Arena.IL]);
    expect(compartmentsToArenas(undefined)).toEqual([]);
  });
});
