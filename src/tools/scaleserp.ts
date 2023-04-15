import { Tool } from "langchain/tools";

type GoogleParameters = {
  gl?: string;
  hl?: string;
};

/**
 * Wrapper around Scale SERP.
 *
 * You can create a free API key at ...
 *
 * To use, you should have the SCALESERP_API_KEY environment variable set.
 */
export class ScaleSerp extends Tool {
  protected key: string;

  protected params: Partial<GoogleParameters>;

  constructor(
    apiKey: string | undefined = typeof process !== "undefined"
      ? // eslint-disable-next-line no-process-env
        process.env.SCALESERP_API_KEY
      : undefined,
    params: Partial<GoogleParameters> = {}
  ) {
    super();

    if (!apiKey) {
      throw new Error(
        "Scale Serp API key not set. You can set it as SCALESER_API_KEY in your .env file, or pass it to ScaleSerp."
      );
    }

    this.key = apiKey;
    this.params = params;
  }

  name = "search";

  /**
   * Run query through ScaleSerpAPI and parse result
   */
  async _call(input: string) {
    const options = {
      headers: {
        Accept: "application/json"
      }
    };

    const url = `https://api.scaleserp.com/search?api_key=${this.key}&q=${input}`
    // "https://api.scaleserp.com/search?api_key=01D22F61AD5B4EBA8F065027B31B667A&q=pizza+and+beer";
    console.log(url);

    const res = await fetch(url, options);
    console.log(res);
    if (!res.ok) {
      throw new Error(`Got ${res.status} error from scale serp: ${res.statusText}`);
    }

    const json = await res.json();

    if (json.answerBox?.answer) {
      return json.answerBox.answer;
    }

    if (json.answerBox?.snippet) {
      return json.answerBox.snippet;
    }

    if (json.answerBox?.snippet_highlighted_words) {
      return json.answerBox.snippet_highlighted_words[0];
    }

    if (json.sportsResults?.game_spotlight) {
      return json.sportsResults.game_spotlight;
    }

    if (json.knowledgeGraph?.description) {
      return json.knowledgeGraph.description;
    }

    if (json.organic?.[0]?.snippet) {
      return json.organic[0].snippet;
    }

    return "No good search result found";
  }

  description =
    "a search engine. useful for when you need to answer questions about current events. input should be a search query.";
}

