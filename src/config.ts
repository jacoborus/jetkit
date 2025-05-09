import "dotenv/config";
import { z } from "zod";

export type EnvVarsSchemaType = z.infer<typeof envVarsSchema>;

const envVarsSchema = z.object({
  ENV: z.union([
    z.literal("production"),
    z.literal("development"),
    z.literal("test"),
  ]),
  API_PORT: z.coerce.number().optional().default(3000),
  HOST: z.string().optional(),
  BASE_URL: z.string(),
  // DATABASE_URL: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  REQUIRE_EMAIL_VERIFICATION: z.coerce.boolean().optional(),
  // Minutes after which access tokens expire
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30),
  // Days after which refresh tokens expire
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30),
  // Minutes after which reset password token expires
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(10),
  // Minutes after which verify email token expires
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(10),
  // EMAIL_SENDER: z.string(),
  // OAUTH_GITHUB_CLIENT_ID: z.string(),
  // OAUTH_GITHUB_CLIENT_SECRET: z.string(),
  // OAUTH_GOOGLE_CLIENT_ID: z.string(),
  // OAUTH_GOOGLE_CLIENT_SECRET: z.string(),
  // OAUTH_GOOGLE_REDIRECT_URL: z.string(),
  // OAUTH_DISCORD_CLIENT_ID: z.string(),
  // OAUTH_DISCORD_CLIENT_SECRET: z.string(),
  // OAUTH_DISCORD_REDIRECT_URL: z.string(),
  // OAUTH_SPOTIFY_CLIENT_ID: z.string(),
  // OAUTH_SPOTIFY_CLIENT_SECRET: z.string(),
  // OAUTH_SPOTIFY_REDIRECT_URL: z.string(),
  // OAUTH_FACEBOOK_CLIENT_ID: z.string(),
  // OAUTH_FACEBOOK_CLIENT_SECRET: z.string(),
  // OAUTH_FACEBOOK_REDIRECT_URL: z.string(),
  // OAUTH_APPLE_CLIENT_ID: z.string(),
  // OAUTH_APPLE_CLIENT_SECRET: z.string(),
  // OAUTH_APPLE_REDIRECT_URL: z.string()
  LOG_LEVEL: z
    .union([
      z.literal("trace"),
      z.literal("debug"),
      z.literal("info"),
      z.literal("warn"),
      z.literal("error"),
      z.literal("fatal"),
    ])
    .default("warn"),
});

const config = envVarsSchema.parse(process.env || {});
export default config;

export const DB_URL = `postgres://${config.DB_USER}:${config.DB_PASSWORD}@localhost:${config.DB_PORT}/${config.DB_NAME}`;
