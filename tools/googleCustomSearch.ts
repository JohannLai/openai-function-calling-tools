import axios from 'axios';

class GoogleCustomSearch {
  googleCustomSearchSchema = {
    name: "googleCustomSearch",
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
        `Google API key not set.`
      );
    }
    if (!fields.googleCSEId) {
      throw new Error(
        `Google custom search engine id not set.`
      );
    }
    this.apiKey = fields.apiKey;
    this.googleCSEId = fields.googleCSEId;

    this.googleCustomSearch = this.googleCustomSearch.bind(this);
  }

  async googleCustomSearch(input: string) {
    console.log("api key", this.apiKey);
    try {
      const res = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.googleCSEId}&q=${encodeURIComponent(
          input
        )}`
      );

      const results =
        res.data?.items?.map((item: { title?: string; link?: string; snippet?: string }) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) ?? [];
      return JSON.stringify(results);
    } catch(error) {
      throw new Error(
        `Error in GoogleCustomSearch: ${error}`
      );
    }
  }
}

export { GoogleCustomSearch };
