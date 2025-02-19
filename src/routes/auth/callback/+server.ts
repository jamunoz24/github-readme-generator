import { json, redirect } from "@sveltejs/kit";
import { VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET_KEY } from "$env/static/private";

export async function GET({ url }) {
  const code = url.searchParams.get("code");

  if (!code) {
    return json({ error: "Missing GitHub code" }, { status: 400 });
  }

  // Step 1: Exchange "code" for an access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      client_id: VITE_GITHUB_CLIENT_ID,
      client_secret: VITE_GITHUB_CLIENT_SECRET_KEY,
      code
    }),
  });

  const { access_token } = await tokenResponse.json();

  if (!access_token) {
    return json({ error: "Failed to retrieve access token" }, { status: 401 });
  }

  // Step 2: Store token in a secure cookie
  return new Response("", {
    status: 302,
    headers: {
      "Set-Cookie": `github_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      Location: "/", // Redirect to the home page after login
    },
  });
}
