import type { Route } from "next";
import z from "zod/v4";

/**
 * Extract routes with a specific base
 * @example RouteWithBase<"/api/"> // "/api/handler-1" | "/api/handler-2"
 */
type RouteWithBase<Base extends string> = Extract<Route, `${Base}${string}`>;

/** API ROUTES */
export const ApiRoutes = z
  .enum(["/api/auth/session/sign-in", "/api/auth/session/sign-out"] satisfies Array<
    RouteWithBase<"/api/">
  >)
  .refine((val) => val.startsWith("/api/"), {
    message: "API routes must start with /api/",
  });

export type ApiRoute = z.infer<typeof ApiRoutes>;

/** PROTECTED ROUTES */
export const ProtectedRoutes = z.enum(["/dashboard"] satisfies Array<
  Exclude<Route, ApiRoute>
>);

export type ProtectedRoute = z.infer<typeof ProtectedRoutes>;

/** PUBLIC ROUTES */
export const PublicRoutes = z.enum(["/", "/auth"] satisfies Array<
  Exclude<Route, ApiRoute | ProtectedRoute>
>);

export type PublicRoute = z.infer<typeof PublicRoutes>;

/** ALL ROUTES */
export const appRoutes = {
  api: ApiRoutes.enum,
  protected: ProtectedRoutes.enum,
  public: PublicRoutes.enum,
};

/** REDIRECT ROUTES */
export const redirectRoutes = {
  onAuthenticated: appRoutes.protected["/dashboard"],
  onNotAuthenticated: appRoutes.public["/auth"],
};
