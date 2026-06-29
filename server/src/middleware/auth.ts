import type { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { HttpError } from "../lib/httpError.js";

const authEnabled = process.env.AUTH_ENABLED === "true";

let verifier: ReturnType<typeof CognitoJwtVerifier.create> | undefined;

const getVerifier = () => {
  if (!verifier) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      throw new HttpError(500, "Auth is enabled but COGNITO_USER_POOL_ID is not configured");
    }
    verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: "access",
      clientId: process.env.COGNITO_CLIENT_ID ?? null,
    });
  }
  return verifier;
};

/**
 * Verifies the Cognito access token from the Authorization header. When
 * AUTH_ENABLED is not "true" (local development) it is a no-op pass-through so
 * the API can be run without a Cognito user pool.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!authEnabled) {
    next();
    return;
  }

  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing or malformed Authorization header");
    }

    const payload = await getVerifier().verify(header.slice("Bearer ".length));
    const username = payload.username as string | undefined;
    req.user = { sub: payload.sub, ...(username ? { username } : {}) };
    next();
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(401, "Invalid or expired token"));
  }
};
