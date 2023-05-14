import mongoose from "mongoose";
import config from "./config.js";

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = config;

const database = {
  connect: async () => {
    try {
      await mongoose.connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}.fimpvdz.mongodb.net/?retryWrites=true&w=majority`
  );
    } catch (error) {
      console.log(error);
    }
  },
};

export default database;