import EventEmitter = require("events");
import { readFile } from "fs/promises";
import { readFileSync } from "fs";
const csvjson = require("csvjson");

import { EVENT_TYPES } from "./types";

export class Importer {
  constructor(private emitter: EventEmitter) {}

  public listen() {
    this.emitter.on(EVENT_TYPES.Changed, (path: string) => {
      const json = this.importSync(path);
      console.log("changed", path, json);
    });
    this.emitter.on(EVENT_TYPES.Removed, (path) => {
      console.log("removed", path);
    });
  }

  public async import(path: string): Promise<Record<string, string>> {
    const file: string = await readFile(path, "utf8");
    return csvjson.toObject(file);
  }

  public importSync(path: string): Record<string, string> {
    const file: string = readFileSync(path, "utf8");
    return csvjson.toObject(file);
  }
}
