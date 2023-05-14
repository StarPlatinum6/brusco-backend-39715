import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 8080,
    DB_URL: process.env.DB_URL,
    SESSION_SECRET: process.env.SESSION_SECRET
};

export default config;