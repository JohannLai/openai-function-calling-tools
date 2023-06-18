import { getEnvironmentVariable } from "../util/env.js";

class GoogleCustomSearch {
  googleCustomSearchSchema = {
    name: "google-custom-search",
    description: "a custom search engine. useful for when you need to answer questions about current events. input should be a search query. outputs a JSON array of results.",
    parameters: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "a search query",
        },
      },
    },
  };

  protected apiKey: string;
  protected googleCSEId: string;

  constructor(
    fields: { apiKey: string; googleCSEId: string }
  ) {
    if (!fields.apiKey) {
      throw new Error(
        `Google API key not set. You can set it as "GOOGLE_API_KEY" in your environment variables.`
      );
    }
    if (!fields.googleCSEId) {
      throw new Error(
        `Google custom search engine id not set. You can set it as "GOOGLE_CSE_ID" in your environment variables.`
      );
    }
    this.apiKey = fields.apiKey;
    this.googleCSEId = fields.googleCSEId;
  }

  async googleCustomSearch(input: string) {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.googleCSEId}&q=${encodeURIComponent(
        input
      )}`
    );

    if (!res.ok) {
      throw new Error(
        `Got ${res.status} error from Google custom search: ${res.statusText}`
      );
    }

    const json = await res.json();

    const results =
      json?.items?.map((item: { title?: string; link?: string; snippet?: string }) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) ?? [];
    return JSON.stringify(results);
  }
}

export { GoogleCustomSearch };
