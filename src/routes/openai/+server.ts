import type { RequestHandler } from './$types';
import type { GithubUser } from '$lib/types/github.js';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { githubUser }: { githubUser: GithubUser } = await request.json();

        if (!githubUser) {
            return new Response(JSON.stringify({ error: "GitHub user data is required" }), { status: 400 });
        }

        // Format the prompt as a structured JSON-like object
        const formattedPrompt = {
            user: {
                name: githubUser.name,
                bio: githubUser.bio || "No bio available",
                website: githubUser.websiteUrl || "No website",
                repos: githubUser.pinnedRepositories.map(repo => ({
                    name: repo.name,
                    description: repo.description || "No description",
                    url: repo.url,
                    readme: repo.readme || "No README content",
                }))
            }
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful AI that analyzes GitHub profiles." },
                    { role: "user", content: `Analyze the following GitHub profile and repositories. From this, generate a readme in markdown format that the user can use for their profile. Do not wrap anything in a code block. Do not make any mentions of missing fields. The profile readme should stand out and highlight the strength of the user's profile. This readme should look appealing to tech recruiters.\n\n${JSON.stringify(formattedPrompt, null, 2)}` }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify({ error: data.error.message || "Failed to fetch OpenAI response" }), { status: response.status });
        }

        return new Response(JSON.stringify({ gptResponse: data.choices[0].message.content }), { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};