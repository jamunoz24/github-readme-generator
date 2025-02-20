import { redirect } from "@sveltejs/kit";
import { VITE_GITHUB_CLIENT_ID } from "$env/static/private";

export async function GET() {
  // Redirect the user to GitHub's OAuth page
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}&scope=read:user,public_repo`;

  throw redirect(302, GITHUB_AUTH_URL);
}

