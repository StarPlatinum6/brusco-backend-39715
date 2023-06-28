import winston from "winston";
import { config } from "../config/config.js";

const {
  logs: { LOGGER },
} = config;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "bold redBG",
    error: "bold red",
    warning: "bold yellow",
    info: "bold blue",
    http: "bold magenta",
    debug: "bold white",
  },
};

const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: LOGGER === "DEVELOPMENT" ? "debug" : "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "error",
    }),
  ],
});

export const winstonLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
