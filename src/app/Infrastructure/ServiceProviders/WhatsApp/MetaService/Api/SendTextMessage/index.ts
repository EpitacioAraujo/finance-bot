import { Axios } from "axios"
import { ReturnDTO } from "./ReturnDTO"
import { InputDTO } from "./InputDTO"

export class SendTextMessage {
  constructor(private client: Axios) {}

  public async execute(input: InputDTO): Promise<ReturnDTO> {
    const response = await this.client.post<ReturnDTO>(`/message`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: input.to,
      type: "text",
      text: {
        preview_url: false,
        body: input.body,
      },
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  }
}
