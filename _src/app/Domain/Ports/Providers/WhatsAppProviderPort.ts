export abstract class WhatsAppProviderPort {
  abstract sendTextMessage(to: string, message: string): Promise<any>
}
