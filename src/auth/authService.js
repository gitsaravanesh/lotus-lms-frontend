// src/auth/authService.js
import axios from "axios";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI } from "./config";

export async function exchangeCodeForToken(code) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", CLIENT_ID);
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);

  const res = await axios.post(`${COGNITO_DOMAIN}/oauth2/token`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
}

export function signOut() {
  const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`;
  window.location.href = logoutUrl;
}