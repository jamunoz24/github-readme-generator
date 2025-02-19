import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const cookies = request.headers.get("cookie");
  const loggedIn = cookies?.includes("github_token=") ?? false;

  return json({ loggedIn });
}
