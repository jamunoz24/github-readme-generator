
export async function GET() {
  const headers = new Headers();
  headers.append("Set-Cookie", "github_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
  headers.append("Set-Cookie", "username=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
  headers.append("Location", "/");

  return new Response(null, { status: 302, headers });
}
