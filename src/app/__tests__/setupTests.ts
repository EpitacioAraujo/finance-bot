import "reflect-metadata"
import dotenv from "dotenv"
import path from "node:path"

// Load test environment variables BEFORE anything else
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
})

// Now import the App to ensure it uses the test environment
import { App } from "@MyFW/index"

let appInstance: App | null = null

beforeAll(async () => {
  if (!appInstance) {
    appInstance = new App()
    await appInstance.initialize()
  }
  // Make the app instance available globally for tests
  global.testAppInstance = appInstance
})

afterAll(async () => {
  if (appInstance) {
    try {
      const dataSource = appInstance.container.resolve<any>("DataSource")
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy()
      }
    } catch (error) {
      // DataSource might not be registered if initialization failed
      console.warn("Could not resolve DataSource for cleanup:", error)
    }
  }
})
