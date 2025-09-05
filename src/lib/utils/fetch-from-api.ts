import { ApiRoutes, type ApiRoute } from "../navigation/routes";

export function fetchFromApi(
  input: ApiRoute,
  init: Parameters<typeof fetch>[1] & {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  },
) {
  const apiRoute = ApiRoutes.parse(input);
  return fetch(apiRoute, init);
}
