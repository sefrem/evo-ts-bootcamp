import EventEmitter = require("events");
import { EVENT_TYPES } from "./types";
const { readdir, readFile } = require("fs/promises");
const path = require("path");

export class DirWatcher {
  private path: string | undefined;
  private delay: number | undefined;

  constructor(private emitter: EventEmitter) {}

  public watch(path: string, delay: number): void {
    this.path = path;
    this.delay = delay;
    this.compare();
  }

  private compare(): void {
    const watched: Map<string, string> = new Map<string, string>();

    setInterval(async () => {
      try {
        const files: string[] = await readdir(this.path as string);

        if (watched.size !== files.length) {
          watched.forEach((_, filePath) => {
            if (!files.includes(filePath)) {
              watched.delete(filePath);
              this.emitter?.emit(
                EVENT_TYPES.Removed,
                path.join(this.path, filePath)
              );
            }
          });
        }

        for await (const filePath of files) {
          const file: string = await readFile(
            path.join(this.path, filePath),
            "utf8"
          );
          const fileContent = file.toString();

          if (!watched.has(filePath)) {
            watched.set(filePath, fileContent);
            this.emitter?.emit(
              EVENT_TYPES.Changed,
              path.join(this.path, filePath)
            );
          }
          if (!(watched.get(filePath) === fileContent)) {
            watched.set(filePath, fileContent);
            this.emitter?.emit(
              EVENT_TYPES.Changed,
              path.join(this.path, filePath)
            );
          }
        }
      } catch (error) {
        console.log(error);
        process.exit(0);
      }
    }, this.delay);
  }
}
