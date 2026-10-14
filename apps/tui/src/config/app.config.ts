import { join } from "node:path";
import os from "node:os";

export const logDir = join(os.homedir(), "Downloads" ,".T:Logger","logs");

