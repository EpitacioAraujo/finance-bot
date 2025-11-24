import express from "express";

// Import container configuration
import { TSyringer } from "@MyFW/Config/TSyringer";
import { Routes } from "./routes";

export class App {
  app = express();
  container!: TSyringer;

  public async initialize() {
    await this.bootstrap();
    await this.loadMiddlewares();
    await this.loadRoutes();
    this.start();
  }

  public async bootstrap() {
    this.container = new TSyringer();
    await this.container.bootstrap();
  }

  public async loadMiddlewares() {
    this.app.use(express.json());
  }

  public async loadRoutes() {
    await new Routes(this.app, this.container).loader();
  }

  public start() {
    this.app.listen(process.env["PORT"] || 3000, () => {
      console.log(`Server is running on port ${process.env["PORT"] || 3000}`);
    });
  }
}
