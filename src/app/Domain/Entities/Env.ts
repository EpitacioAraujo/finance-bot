export class Env {
  public port: string = process.env["PORT"] || "80";

  public nodeEnv: string = process.env["NODE_ENV"] || "development";

  public dbPostgresHost: string =
    process.env["DB_POSTGRES_HOST"] || "localhost";

  public dbPostgresPort: string = process.env["DB_POSTGRES_PORT"] || "5432";

  public dbPostgresDb: string = process.env["DB_POSTGRES_DB"] || "finance_bot";

  public dbPostgresUser: string =
    process.env["DB_POSTGRES_USER"] || "finance_user";

  public dbPostgresPassword: string =
    process.env["DB_POSTGRES_PASSWORD"] || "finance_password";

  public redisHost: string = process.env["REDIS_HOST"] || "localhost";

  public redisPort: string = process.env["REDIS_PORT"] || "6379";

  public whatsappApiTokenVerifyToken: string =
    process.env["WHATSAPP_API_TOKEN_VERIFY_TOKEN"] || "3000";

  public whatsappApiToken: string = process.env["WHATSAPP_API_TOKEN"] || "3000";

  public whatsappPhoneNumberId: string =
    process.env["WHATSAPP_PHONE_NUMBER_ID"] || "3000";

  public facebookGraphApiUrl: string =
    process.env["FACEBOOK_GRAPH_API_URL"] || "3000";

  public assemblyaiApiKey: string = process.env["ASSEMBLYAI_API_KEY"] || "3000";

  public transcriptionProvider: string =
    process.env["TRANSCRIPTION_PROVIDER"] || "3000";
  public deepseekApiKey: string | undefined = process.env["DEEPSEEK_API_KEY"];
}
