import EventEmitter = require("events");
import { EVENT_TYPES } from "./types";

const { readdir, readFile } = require("fs/promises");
const path = require("path");

export class DirWatcher {
  private path: string | undefined;
  private delay: number | undefined;
  private watched = new Map<string, string>();

  constructor(private emitter: EventEmitter) {}

  public watch(path: string, delay: number): void {
    this.path = path;
    this.delay = delay;
    this.compare();
  }

  private compare(): void {
    setInterval(async () => {
      try {
        const files: string[] = await readdir(this.path as string);

        this.checkIfFileRemovedOrRenamed(files);

        files.forEach(async (filePath) => {
          const file: string = await readFile(
            path.join(this.path, filePath),
            "utf8"
          );
          const fileContent = file.toString();

          this.checkIfFileAdded(filePath, fileContent);
          this.checkIfFileChanged(filePath, fileContent);
        });
      } catch (error) {
        console.log(error);
        process.exit(0);
      }
    }, this.delay);
  }

  private checkIfFileRemovedOrRenamed(files: string[]) {
    if (this.watched.size !== files.length) {
      this.watched.forEach((_, filePath) => {
        if (!files.includes(filePath)) {
          this.watched.delete(filePath);
          this.emitter?.emit(
            EVENT_TYPES.Removed,
            path.join(this.path, filePath)
          );
        }
      });
    }
  }

  private checkIfFileAdded(filePath: string, fileContent: string) {
    if (!this.watched.has(filePath)) {
      this.watched.set(filePath, fileContent);
      this.emitter?.emit(EVENT_TYPES.Changed, path.join(this.path, filePath));
    }
  }

  private checkIfFileChanged(filePath: string, fileContent: string) {
    if (!(this.watched.get(filePath) === fileContent)) {
      this.watched.set(filePath, fileContent);
      this.emitter?.emit(EVENT_TYPES.Changed, path.join(this.path, filePath));
    }
  }
}
