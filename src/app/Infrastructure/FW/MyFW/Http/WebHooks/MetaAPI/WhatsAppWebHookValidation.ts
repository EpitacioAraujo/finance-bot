import { Request, Response } from "express"

export function WhatsAppWebHookValidation(req: Request, res: Response) {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]
  const verifyToken = process.env["WHATSAPP_API_TOKEN_VERIFY_TOKEN"]

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ WEBHOOK VERIFIED")
    return res.status(200).send(challenge)
  }

  console.log("❌ WEBHOOK VERIFICATION FAILED")
  return res.status(403).send("Forbidden")
}
