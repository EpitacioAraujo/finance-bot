/**
 * Environment Variables Type Definitions
 * Type-safe access to process.env
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      PORT?: string
      NODE_ENV?: "development" | "production" | "test"

      DB_POSTGRES_USER?: string
      DB_POSTGRES_PASSWORD?: string
      DB_POSTGRES_DB?: string
      DB_POSTGRES_PORT?: string
      DB_POSTGRES_HOST?: string

      // Redis Configuration
      REDIS_HOST?: string
      REDIS_PORT?: string

      // WhatsApp Cloud API
      FACEBOOK_GRAPH_API_URL: string
      WHATSAPP_PHONE_NUMBER_ID: string
      WHATSAPP_API_TOKEN: string
      WHATSAPP_WEBHOOK_VERIFY_TOKEN: string

      // AI Services
      ASSEMBLYAI_API_KEY: string
      TRANSCRIPTION_PROVIDER?: "assemblyai" | "whisper" | "deepgram"
    }
  }
}

export {}
