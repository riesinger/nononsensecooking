import parse from "csv-parse/lib/sync";
import { ungzip } from "node-gzip";
import { SupportedLanguage } from "../models/Localized";

export class GoatcounterClient {
  private readonly POLLING_TIMEOUT_MS = 10000;

  constructor(private apiKey: string, private baseUrl: string) {}

  /**
   * Returns the most popular recipes' ids
   * @param locale The locale to query for
   * @returns A map from Recipe ID to the number of page hits
   */
  public async fetchMostPopularRecipesForLocale(
    locale: SupportedLanguage
  ): Promise<{ [recipeId: string]: number }> {
    const exportId = await this.triggerExport();
    await this.pollForExportFinished(exportId);
    const exportedFile = await this.downloadExport(exportId);
    const pagehits = await this.parseExport(exportedFile);
    const filteredPagehits = pagehits
      .filter(excludeBotPagehits)
      .filter(excludeNonRecipePagehits);
    return this.accumulatePagehits(filteredPagehits);
  }

  private async triggerExport(): Promise<number> {
    const response = await fetch(`${this.apiUrl}/export`, {
      method: "POST",
      body: JSON.stringify({
        start_from_hit_id: 0,
      }),
      headers: {
        ...this.authHeader,
        ...this.contentTypeJSON,
      },
    });

    assertStatusCode(202, response, "Queueing export failed");
    const { id } = await response.json();
    return id;
  }

  private async pollForExportFinished(exportId: number) {
    // It is very likely that the export needs at least some time to finish.
    // Waiting for a short amount of time thus makes it likelier that the export is already available on the first poll
    sleep(500);
    const startTime = new Date().getTime();
    while (now() - startTime < this.POLLING_TIMEOUT_MS) {
      console.log(`Polling for export ${exportId} to be ready`);
      const response = await fetch(`${this.apiUrl}/export/${exportId}`, {
        headers: {
          ...this.authHeader,
          ...this.contentTypeJSON,
        },
      });

      assertStatusCode(200, response, "Polling for export failed");
      const { finished_at, error } = await response.json();
      if (error) {
        throw new Error(`Export failed: ${error}`);
      }
      if (finished_at !== null) {
        console.log(`Export ${exportId} is ready`);
        return;
      }
      await sleep(1000);
    }
    throw new TimeoutError();
  }

  private async downloadExport(exportId: number): Promise<string> {
    const response = await fetch(`${this.apiUrl}/export/${exportId}/download`, {
      headers: {
        ...this.authHeader,
      },
    });
    assertStatusCode(200, response, "Downloading export failed");
    const blob = await response.blob();
    const data = await ungzip(await blob.arrayBuffer());
    return data.toString();
  }

  private async parseExport(data: string) {
    switch (data[0]) {
      case "1":
        return await this.parseExportV1(data);
      case "2":
        return await this.parseExportV2(data);
      default:
        throw new Error(`Unsupported export data version: ${data[0]}`);
    }
  }

  private async parseExportV1(data: string) {
    const pagehits = parse(data, {
      columns: true,
      autoParse: true,
      skipEmptyLines: true,
    });
    return pagehits.map(
      (rawHit: RawPageHitV1): ParsedPageHit => ({
        path: rawHit["1Path"].toString(),
        bot: rawHit.Bot !== "0",
      })
    );
  }

  private async parseExportV2(data: string) {
    const pagehits = parse(data, {
      columns: true,
      autoParse: true,
      skipEmptyLines: true,
    });
    return pagehits.map(
      (rawHit: RawPageHitV2): ParsedPageHit => ({
        path: rawHit["2Path"].toString(),
        bot: rawHit.Bot !== "0",
      })
    );
  }

  private accumulatePagehits = (pagehits: ParsedPageHit[]) =>
    pagehits.reduce(
      (accumulator: { [recipeId: string]: number }, hit: ParsedPageHit) => {
        const [_, recipeId] = hit.path.match(/\/r\/(.*)\/.*$/);
        accumulator[recipeId] = accumulator[recipeId]
          ? accumulator[recipeId] + 1
          : 1;
        return accumulator;
      },
      {}
    );

  private get apiUrl(): string {
    return this.baseUrl + "/api/v0";
  }

  private get authHeader() {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  private get contentTypeJSON() {
    return { "Content-Type": "application/json" };
  }
}

interface RawPageHitV1 {
  "1Path": string;
  Title: string;
  Event: string;
  Bot: string;
  Session: string;
  FirstVisit: string;
  Referrer: string;
  Browser: string;
  "Screen size": string;
  Location: string;
  Date: string;
}

interface RawPageHitV2 {
  "2Path": string;
  Title: string;
  Event: string;
  Bot: string;
  Session: string;
  FirstVisit: string;
  Referrer: string;
  Browser: string;
  "Screen size": string;
  Location: string;
  Date: string;
  "User-Agent": string;
  System: string;
  "Referrer scheme": string;
}

interface ParsedPageHit {
  path: string;
  bot: boolean;
}

const excludeBotPagehits = (hit: ParsedPageHit) => !hit.bot;
const excludeNonRecipePagehits = (hit: ParsedPageHit) =>
  hit.path.includes("/r/");

async function sleep(timeoutInMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutInMs);
  });
}

export class HttpStatusError extends Error {
  readonly name = "HttpStatusError";

  constructor(
    expectedStatus: number,
    actualStatus: number,
    message: string = "Unexpected status code"
  ) {
    super(message);
    this.message = `${message}: Expected status ${expectedStatus} but got ${actualStatus}`;
  }
}

export class TimeoutError extends Error {
  readonly name = "TimeoutError";
  constructor(message: string = "Timed out while polling for exports") {
    super(message);
  }
}

function assertStatusCode(
  expectedStatus: number,
  response: Response,
  message?: string
) {
  if (response.status !== expectedStatus) {
    throw new HttpStatusError(expectedStatus, response.status, message);
  }
}

function now() {
  return new Date().getTime();
}
