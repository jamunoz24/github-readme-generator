import { redirect } from "@sveltejs/kit";

export async function GET() {
  return new Response("", {
    status: 302,
    headers: {
      "Set-Cookie": "github_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
      Location: "/"
    }
  });
}
