import { Axios } from "axios"
import fs from "node:fs"
import path from "path"

export class DownloadAudio {
  constructor(private client: Axios) {}

  public async execute(url: string): Promise<string> {
    const response = await this.client.get(url, {
      responseType: "arraybuffer",
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to download audio: ${response.status} ${response.statusText}`
      )
    }

    const buffer = response.data

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Generate filename with mediaId and timestamp
    const timestamp = Date.now()
    const filename = `audio_${timestamp}.ogg`
    const filepath = path.join(tempDir, filename)

    // Save file
    fs.writeFileSync(filepath, Buffer.from(buffer))
    console.log(`📥 Audio downloaded: ${filepath}`)

    return filepath
  }
}
