import type { GithubUser } from '$lib/types/github.ts';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_ACCESS_TOKEN;

export async function GET({ request }) {
    // Step 1: Check if a user is authenticated (via OAuth)
    const cookies = request.headers.get("cookie");
    const userTokenMatch = cookies?.match(/github_token=([^;]+)/);
    const userAccessToken = userTokenMatch ? userTokenMatch[1] : null;

    // Get username cookie
    const usernameMatch = cookies?.match(/username=([^;]+)/);
    const username = usernameMatch ? usernameMatch[1] : null;

    if (!userAccessToken) {
        return new Response("Authentication required", { status: 401 });
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
                  defaultBranchRef {
                    name
                  }
                  object(expression: "main:README.md") {
                    ... on Blob {
                      text
                    }
                  }
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
            "Authorization": `Bearer ${userAccessToken}`,
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
    
    // Map data to 
    const user: GithubUser = {
      name: data.data.user.name,
      websiteUrl: data.data.user.websiteUrl,
      bio: data.data.user.bio,
      avatarUrl: data.data.user.avatarUrl,
      pinnedRepositories: data.data.user.pinnedItems.nodes.map((node: any) => ({
        name: node.name,
        description: node.description,
        url: node.url,
        readme: node.object?.text || null
      })),
      additionalDesc: null
    }

    return new Response(JSON.stringify(user), { status: 200 });
}
