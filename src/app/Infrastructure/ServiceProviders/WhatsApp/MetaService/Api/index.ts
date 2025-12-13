import "reflect-metadata"
import { injectable } from "tsyringe"
import { Axios } from "axios"

import { GetAudioUrl } from "./GetAudioUrl"
import { DownloadAudio } from "./DownloadAudio"

@injectable()
export class WhatsAppMetaAPI {
  private client: Axios

  constructor() {
    this.client = new Axios({
      baseURL: process.env["FACEBOOK_GRAPH_API_URL"],
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_API_TOKEN"]}`,
      },
    })
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    return new GetAudioUrl(this.client).execute(mediaId)
  }

  async audioDownload(mediaUrl: string): Promise<string> {
    return new DownloadAudio(this.client).execute(mediaUrl)
  }
}
