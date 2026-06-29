import "express";

declare global {
  namespace Express {
    interface Request {
      /** Populated by requireAuth when a valid Cognito access token is presented. */
      user?: {
        sub: string;
        username?: string;
      };
    }
  }
}

export {};
