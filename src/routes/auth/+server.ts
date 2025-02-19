import { json, redirect } from "@sveltejs/kit";
import { VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET_KEY } from "$env/static/private";

// Step 1: Redirect user to GitHub for authentication
export async function GET({ url }) {
  const code = url.searchParams.get("code");

  if (!code) {
    // Redirect user to GitHub OAuth login
    const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}&scope=read:user,public_repo`;
    throw redirect(302, GITHUB_AUTH_URL);
  }

  // Step 2: Exchange "code" for an access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: VITE_GITHUB_CLIENT_ID,
      client_secret: VITE_GITHUB_CLIENT_SECRET_KEY,
      code
    }),
  });

  const { access_token } = await tokenResponse.json();

  if (!access_token) {
    return json({ error: "GitHub authentication failed" }, { status: 401 });
  }

  // Step 3: Store token in cookies and redirect
  return new Response("", {
    status: 302,
    headers: {
      "Set-Cookie": `github_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      Location: "/"
    }
  });
}
