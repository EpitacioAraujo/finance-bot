export class Env {
    private static instance: Env | null = null;

    public NODE_ENV: string;
    public PORT: string;
    public DATABASE_HOST: string;
    public DATABASE_PORT: string;
    public DATABASE_NAME: string;
    public DATABASE_USER: string;
    public DATABASE_PASSWORD: string;
    public DB_HOST: string;
    public DB_PORT: string;
    public DB_NAME: string;
    public DB_USER: string;
    public DB_PASSWORD: string;
    public JWT_SECRET: string;
    public DB_LOGGING: string;
    public CORS_ORIGIN: string;
    public COOKIE_SAMESITE: string;

    private constructor() {
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.PORT = process.env.PORT || '';
        this.DATABASE_HOST = process.env.DATABASE_HOST || '';
        this.DATABASE_PORT = process.env.DATABASE_PORT || '';
        this.DATABASE_NAME = process.env.DATABASE_NAME || '';
        this.DATABASE_USER = process.env.DATABASE_USER || '';
        this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
        this.DB_HOST = process.env.DB_HOST || this.DATABASE_HOST;
        this.DB_PORT = process.env.DB_PORT || this.DATABASE_PORT;
        this.DB_NAME = process.env.DB_NAME || this.DATABASE_NAME;
        this.DB_USER = process.env.DB_USER || this.DATABASE_USER;
        this.DB_PASSWORD = process.env.DB_PASSWORD || this.DATABASE_PASSWORD;
        this.JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
        this.DB_LOGGING = process.env.DB_LOGGING || 'false';
        this.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
        this.COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || 'lax';
    }

    public static getInstance(): Env {
        if (!Env.instance) {
            Env.instance = new Env();
        }

        return Env.instance;
    }

    public isProduction(): boolean {
        return this.NODE_ENV === 'production';
    }
}