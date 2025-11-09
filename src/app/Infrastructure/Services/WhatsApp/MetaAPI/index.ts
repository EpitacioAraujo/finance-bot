import { Axios } from "axios";
import fs from "node:fs";
import path from "path";

export class WhatsAppMetaAPI {
  private client: Axios;

  constructor() {
    this.client = new Axios({
      baseURL: process.env["FACEBOOK_GRAPH_API_URL"],
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_API_TOKEN"]}`,
      },
    });
  }

  async getMediaUrl(mediaId: string): Promise<string> {
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

  async audioDownload(mediaUrl: string, mediaId: string): Promise<string> {
    const response = await this.client.get(mediaUrl, {
      responseType: "arraybuffer",
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to download audio: ${response.status} ${response.statusText}`
      );
    }

    const buffer = response.data;

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate filename with mediaId and timestamp
    const timestamp = Date.now();
    const filename = `audio_${mediaId}_${timestamp}.ogg`;
    const filepath = path.join(tempDir, filename);

    // Save file
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`📥 Audio downloaded: ${filepath}`);

    return filepath;
  }

  async sendMessage(numberId: string, mensagem: string) {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: numberId,
      type: "text",
      text: {
        preview_url: false,
        body: mensagem,
      },
    };

    const response = await this.client.post(
      `/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.data}`
      );
    }

    const data = JSON.parse(response.data);
    console.log("Message sent successfully:", data);
    return data;
  }
}
