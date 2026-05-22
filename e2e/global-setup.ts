import * as fs from "node:fs";
import * as path from "node:path";
import { clearFixturesCache } from "./utils/fixtures-cache";

/** Clears cached listing ids so a re-seeded DB does not break detail/API tests. */
async function globalSetup() {
  clearFixturesCache();
  fs.mkdirSync(path.join(__dirname, ".artifacts"), { recursive: true });
}

export default globalSetup;
