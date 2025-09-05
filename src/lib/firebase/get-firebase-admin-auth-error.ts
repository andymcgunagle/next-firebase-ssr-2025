import { FirebaseAuthError } from "firebase-admin/auth";

/**
 * Maps Firebase Admin Auth errors to HTTP status codes and messages.
 * @see https://firebase.google.com/docs/auth/admin/errors
 */
export function getFirebaseAdminAuthError(error: unknown) {
  let code = "internal-error";
  let message = "Server error";
  let status = 500;

  if (error instanceof FirebaseAuthError) {
    code = error.code;
    message = error.message;

    switch (code) {
      /** Authentication / Token issues */
      case "auth/id-token-expired":
      case "auth/invalid-id-token":
      case "auth/invalid-session-cookie":
      case "auth/session-cookie-expired":
        status = 401; /** Unauthorized */
        break;

      /** Argument / request errors */
      case "auth/argument-error":
      case "auth/invalid-action-code":
      case "auth/invalid-argument":
      case "auth/invalid-continue-uri":
      case "auth/invalid-credential":
      case "auth/invalid-display-name":
      case "auth/invalid-email":
      case "auth/invalid-oauth-client-id":
      case "auth/invalid-oauth-client-secret":
      case "auth/invalid-password":
      case "auth/invalid-phone-number":
      case "auth/invalid-photo-url":
      case "auth/invalid-provider-id":
      case "auth/invalid-tenant-id":
      case "auth/invalid-uid":
      case "auth/invalid-verification-code":
      case "auth/invalid-verification-id":
      case "auth/missing-continue-uri":
      case "auth/missing-display-name":
      case "auth/missing-email":
      case "auth/missing-hash-algorithm":
      case "auth/missing-oauth-client-id":
      case "auth/missing-oauth-client-secret":
      case "auth/missing-password":
      case "auth/missing-phone-number":
      case "auth/missing-photo-url":
      case "auth/missing-provider-id":
      case "auth/missing-tenant-id":
      case "auth/missing-uid":
        status = 400; /** Bad Request */
        break;

      /** Already exists / conflict */
      case "auth/email-already-exists":
      case "auth/phone-number-already-exists":
      case "auth/uid-already-exists":
        status = 409; /** Conflict */
        break;

      /** Not found */
      case "auth/project-not-found":
      case "auth/tenant-not-found":
      case "auth/user-not-found":
        status = 404; /** Not Found */
        break;

      /** Forbidden / insufficient permissions */
      case "auth/insufficient-permission":
      case "auth/operation-not-allowed":
      case "auth/uid-not-allowed":
      case "auth/unauthorized-continue-uri":
        status = 403; /** Forbidden */
        break;

      /** Too many requests */
      case "auth/too-many-requests":
        status = 429;
        break;

      /** Internal or unexpected */
      case "auth/internal-error":
      case "auth/network-request-failed":
        status = 500;
        break;

      default:
        status = 500;
        break;
    }
  }

  return {
    code,
    codeAndMessage: `${code}: ${message}`,
    message,
    status,
  };
}
