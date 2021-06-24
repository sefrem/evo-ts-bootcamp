import * as path from "path";
import EventEmitter = require("events");
import { DirWatcher } from "./dirwatcher";
import { Importer } from "./importer";

const emitter = new EventEmitter();
const watcher = new DirWatcher(emitter);
const importer = new Importer(emitter);

watcher.watch(path.join(__dirname, "/data"), 100);
importer.listen();
