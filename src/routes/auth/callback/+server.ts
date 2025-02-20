import { json } from "@sveltejs/kit";
import { VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET_KEY } from "$env/static/private";

/**
 * Helper function to exchange GitHub code for an access token
 */
async function getGitHubAccessToken(code: string): Promise<string | null> {
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
  return access_token || null;
}

export async function GET({ url }) {
  const code = url.searchParams.get("code");

  if (!code) {
    return json({ error: "GitHub authentication failed" }, { status: 400 });
  }

  const access_token = await getGitHubAccessToken(code);

  if (!access_token) {
    return json({ error: "Failed to retrieve access token" }, { status: 401 });
  }

  // Send the token to the main window and close the popup
  return new Response(`
    <script>
      window.opener.postMessage({ github_token: "${access_token}" }, window.location.origin);
      window.close();
    </script>
  `, {
    headers: { 
      "Content-Type": "text/html",
      "Set-Cookie": `github_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=None`,
    }
  });
}
