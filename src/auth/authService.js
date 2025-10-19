import { TOKEN_ENDPOINT, CLIENT_ID, REDIRECT_URI } from "./config";

const ID_KEY = "lms_id_token";
const ACCESS_KEY = "lms_access_token";
const REFRESH_KEY = "lms_refresh_token";

export const decodeJwt = (jwt) => {
  if (!jwt) return null;
  try {
    const payload = jwt.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export function persistTokens(tokens) {
  if (tokens.id_token) localStorage.setItem(ID_KEY, tokens.id_token);
  if (tokens.access_token) localStorage.setItem(ACCESS_KEY, tokens.access_token);
  if (tokens.refresh_token) localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
}

export async function exchangeCodeForTokens(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const tokens = await res.json();
  persistTokens(tokens);
  return tokens;
}

export async function refreshTokens() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) throw new Error("No refresh token");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  const tokens = await res.json();
  persistTokens(tokens);
  return tokens;
}

export const getUserFromIdToken = () => decodeJwt(localStorage.getItem(ID_KEY));
export function clearTokens() {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.clear();
}