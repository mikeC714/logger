import { test, expect, describe, afterEach } from "bun:test";
import { Log } from "../log.ts";
import fs from "node:fs/promises";

describe("Folder", () => {
	console.log(process.env.REMOVE);
	console.log(process.env.RENAME);

	const log = new Log();
	const data = "TEST_FOLDER_LOGGER";

  afterEach(async () => {
	await fs.rm(process.env.REMOVE as string, { recursive:true, force:true });
  });

  test("CREATE log", async () => {
    await log.create(data);
    const value = await log.get(data);
    const value2 = await log.get(data);

    expect(value).toBeDefined();
	expect(value2).toBeDefined();
  });

 test("RENAME log", async() => {
	const newName = "Logger_log_test"
	const values = await log.rename(newName, data);
	expect(values?.new).toBe(process.env.RENAME as string);
	expect(values?.old).toBe(undefined);
 });

 test("DELETE log", async() => {
	 const value = await log.delete(data).catch(() => {});
	 expect(value).toBe(`Log: ${data} doesn't exist.`);
 });
});

