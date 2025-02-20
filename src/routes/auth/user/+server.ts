import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const cookies = request.headers.get("cookie");
  const tokenMatch = cookies?.match(/github_token=([^;]+)/);
  const accessToken = tokenMatch ? tokenMatch[1] : null;

  if (!accessToken) {
      return json({ loggedIn: false, error: "Not authenticated" }, { status: 200 });
  }

  // Fetch GitHub user data
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
      headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
      },
  });

  if (!response.ok) {
      return json({ loggedIn: false, error: "Failed to fetch GitHub user data" }, { status: 500 });
  }

  const userData = await response.json();

  // Store username as a cookie
  return json({ loggedIn: true }, {
    headers: {
      "Set-Cookie": `username=${userData.login}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    }
  });
}
