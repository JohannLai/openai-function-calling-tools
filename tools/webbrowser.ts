import axiosMod, { AxiosRequestConfig, AxiosStatic } from "axios";
import * as cheerio from "cheerio";

const DEFAULT_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "en-US,en;q=0.5",
  "Alt-Used": "LEAVE-THIS-KEY-SET-BY-TOOL",
  Connection: "keep-alive",
  Host: "www.google.com",
  Referer: "https://www.google.com/",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
};

class Webbrowser {
  webbrowserSchema = {
    name: "webbrowser",
    description: "useful for when you need to summarize a webpage. input should be a ONE valid http URL including protocol.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "a valid http URL including protocol",
        },
      }
    }
  };

  webbrowser = async (url: string) => {
    let text;
    try {
      const html = await this.getHtml(url);
      text = this.getText(html, url);

      return text;
    } catch (e) {
      if (e) {
        return e.toString();
      }
      return "There was a problem connecting to the site";
    }
  }

  private getHtml = async (url: string) => {
    const axios = (
      "default" in axiosMod ? axiosMod.default : axiosMod
    ) as AxiosStatic;
    const config: AxiosRequestConfig = {
      headers: DEFAULT_HEADERS,
    };

    let htmlResponse;

    try {
      htmlResponse = await axios.get(url);
    } catch (error) {
      throw new Error(`Error in getHtml: ${error}`);
    }

    const allowedContentTypes = [
      "text/html",
      "application/json",
      "application/xml",
      "application/javascript",
      "text/plain",
    ];

    const contentType = htmlResponse.headers["content-type"];
    const contentTypeArray = contentType.split(";");
    if (
      contentTypeArray[0] &&
      !allowedContentTypes.includes(contentTypeArray[0])
    ) {
      throw new Error("returned page was not utf8");
    }

    return htmlResponse.data;
  };

  private getText = (html: string,  baseUrl: string) => {
    // scriptingEnabled so noscript elements are parsed
    const $ = cheerio.load(html, { scriptingEnabled: true });


    let text = "";

    const rootElement = "body";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $(`${rootElement}:not(style):not(script):not(svg)`).each((_i:any, elem: any) => {
      // we dont want duplicated content as we drill down so remove children
      //  let content = $(elem).clone().children().remove().end().text().trim();
      let content = $(elem).text().trim();
      const $el = $(elem);
  
      // if its an ahref, print the content and url
      let href = $el.attr("href");
      if ($el.prop("tagName")?.toLowerCase() === "a" && href) {
        if (!href.startsWith("http")) {
          try {
            href = new URL(href, baseUrl).toString();
          } catch {
            // if this fails thats fine, just no url for this
            href = "";
          }
        }
  
        const imgAlt = $el.find("img[alt]").attr("alt")?.trim();
        if (imgAlt) {
          content += ` ${imgAlt}`;
        }
  
        text += ` [${content}](${href})`;
      }
      // otherwise just print the content
      else if (content !== "") {
        text += ` ${content}`;
      }
    });

      console.log(text.trim());
      console.log(123123);
      return text.trim();
    }
}
export {
  Webbrowser
};
