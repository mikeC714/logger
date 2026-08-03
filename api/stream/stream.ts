import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import zlib from "node:zlib"; 
import path from "node:path";


export class Stream{

	saveToDisk = async(projectKey:string, data:Array<[string, string[]]>) => {
		const data = await this.redis.xrange(
			projectKey,
			"-",
			lastId,
			"COUNT",
			8000
		)
	}
}
