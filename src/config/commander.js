import { Command } from "commander";

const program = new Command();

program.option("-p <type>", "persistence type", "MONGO");
program.option("-env <type>", "environment", "DEVELOPMENT");
program.parse(process.argv);

const options = program.opts();
export const persistenceType = options.p || "MONGO";
export const environment = options.Env || "DEVELOPMENT";