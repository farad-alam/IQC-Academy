/**
 * Fetch wrapper that automatically retries with a token refresh on 401.
 * 
 * Use this for any client-side API calls to protected endpoints
 * (exam submit, module complete, quiz attempt, etc.) to prevent
 * "Unauthorized" errors when the accessToken cookie has expired.
 */
export async function fetchWithAuth(url, options = {}) {
  let res = await fetch(url, options);

  if (res.status === 401) {
    // Attempt to refresh the access token
    try {
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
      if (refreshRes.ok) {
        // Retry the original request with the new cookie
        res = await fetch(url, options);
      }
    } catch {
      // Refresh failed — return original 401 response
    }
  }

  return res;
}
