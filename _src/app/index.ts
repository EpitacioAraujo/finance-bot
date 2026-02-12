import "reflect-metadata"
import dotenv from "dotenv"
import path from "node:path"

import { App } from "@MyFW/index"

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
})
;(async () => {
  const app = new App()
  await app.initialize()
  app.server()
})()
