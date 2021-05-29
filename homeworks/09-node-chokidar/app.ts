import * as path from "path";
import { DirWatcher } from "./dirwatcher";
import EventEmitter = require("events");
import { Importer } from "./importer";

const emitter = new EventEmitter();

const watcher = new DirWatcher(emitter);
const importer = new Importer(emitter);

watcher.watch(path.join(__dirname, "/data"), 100);
importer.listen();
