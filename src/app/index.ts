import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";

import { App } from "@MyFW/index";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

new App().initialize();
