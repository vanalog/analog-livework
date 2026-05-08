"use server";

/**
 * Stub for server-side token retrieval.
 * Auth is disabled for this frontend-only deployment.
 * When you're ready to wire up auth, replace this with your auth provider integration.
 */
async function getServerSideToken(): Promise<string | null> {
  // No auth configured - return null
  return null;
}

export { getServerSideToken };
