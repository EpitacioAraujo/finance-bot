import { Axios } from "axios";

export class GetAudioUrl {
  constructor(private client: Axios) {}

  public async execute(mediaId: string): Promise<string> {
    const response = await this.client.get(`/${mediaId}`);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(response.data) as { url?: string };

    if (!data.url) {
      throw new Error("Media URL not found in response");
    }

    return data.url;
  }
}
