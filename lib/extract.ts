import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function extractTextFromUrl(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    httpsAgent: process.env.NODE_ENV === "development" ? agent : undefined,
  });

  const $ = cheerio.load(data);
  $("script, style, nav, footer, header").remove();

  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim();
}
