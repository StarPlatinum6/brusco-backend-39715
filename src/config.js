import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 8080,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD
};

export default config;