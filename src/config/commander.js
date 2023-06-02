import { Command } from "commander";

const program = new Command();

program.option("-p <type>", "persistence type", "MONGO");
program.parse(process.argv);

const options = program.opts();
const persistenceType = options.p || "MONGO";

export default persistenceType;