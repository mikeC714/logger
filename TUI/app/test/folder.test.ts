import { test, expect, describe, afterEach } from "bun:test";
import { Folder } from "../folder.ts";
import fs from "node:fs/promises";

describe("Folder", () => {
	console.log(process.env.REMOVE);
	console.log(process.env.RENAME);

	const folder = new Folder();
	const data = "TEST_FOLDER_LOGGER";

  afterEach(async () => {
	await fs.rm(process.env.REMOVE as string, { recursive:true, force:true });
  });

  test("CREATE folder", async () => {
    await folder.create(data);
    const value = await folder.get(data);
    const value2 = await folder.get(data);

    expect(value).toBeDefined();
	expect(value2).toBeDefined();
  });

 test("RENAME folder", async() => {
	const newName = "Logger_folder_test"
	const values = await folder.rename(newName, data);
	expect(values?.new).toBe(process.env.RENAME as string);
	expect(values?.old).toBe(undefined);
 });

 test("DELETE folder", async() => {
	 const value = await folder.delete(data).catch(() => {});
	 expect(value).toBe(`Log: ${data} doesn't exist.`);
 });
});

