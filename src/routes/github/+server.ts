const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_ACCESS_TOKEN;

export async function GET({ url }) {
    const username = url.searchParams.get("username") || "octocat";
    if (!username) {
        return new Response("Please provide a username", { status: 400 });
    }

    const query = {
        query: `
        {
          user(login: "${username}") {
            name
            bio
            avatarUrl
            websiteUrl
            pinnedItems(first: 6, types: [REPOSITORY]) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                }
              }
            }
          }
        }
        `
    };

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(query)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Github API error", errorText);
        return new Response("Failed to fetch data", { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
}
