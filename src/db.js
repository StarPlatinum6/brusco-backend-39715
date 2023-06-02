import mongoose from "mongoose";
import config from "./config/config.js";

const { DB_URL } = config;

const database = {
  connect: async () => {
    try {
      await mongoose.connect(DB_URL);
    } catch (error) {
      console.log(error);
    }
  },
};

export default database;
