import dotenv from "dotenv";
import { environment } from "./commander.js";

dotenv.config({
  path: environment === "DEVELOPMENT" ? "./.env.dev" : "./.env.prod",
});

const config = {
  PORT: process.env.PORT || 8080,
  // DB
  DB_URL: process.env.DB_URL,
  // JWT
  // agregar cookie name
  JWT_SECRET: process.env.JWT_SECRET,
  // GitHub App
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackUrl: process.env.CALLBACK_URL,
  // Admin Account
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  // Email Credentials
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  // Logger
  LOGGER: process.env.LOGGER,
};

export default config;
