import { type DependencyContainer } from "tsyringe"
import * as fs from "fs"
import * as path from "path"
import { basedir } from "../../../Utils/basedir"

// Blacklist of disallowed file names
const blackListFiles = ["input.ts", "output.ts"]

/**
 * Recursively finds all TypeScript files in a directory
 * @param dir - Directory path to search
 * @param fileList - Accumulated list of files
 * @returns Array of file paths
 */
function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList)
    } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
      // Check if file name is in whitelist
      const isBlackListed = blackListFiles.some(
        (blackListFile) => file === blackListFile
      )

      if (!isBlackListed) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

export async function bootstrapControllers(
  container: DependencyContainer
): Promise<void> {
  const controllersPath = basedir("Http/Controllers")
  const webHooksPath = basedir("Http/WebHooks")

  // Find all controller files
  const controllerFiles: string[] = []

  if (fs.existsSync(controllersPath)) {
    findTypeScriptFiles(controllersPath, controllerFiles)
  }

  if (fs.existsSync(webHooksPath)) {
    findTypeScriptFiles(webHooksPath, controllerFiles)
  }

  // Dynamically import and register each controller
  for (const filePath of controllerFiles) {
    try {
      const module = await import(filePath)

      // Register all exported classes from the module
      for (const exportName in module) {
        const exportedItem = module[exportName]

        // Check if it's a class (constructor function)
        if (typeof exportedItem === "function" && exportedItem.prototype) {
          container.registerSingleton(exportedItem)
          console.log(
            `✓ Registered controller: ${exportName} from ${path.relative(basedir(), filePath)}`
          )
        }
      }
    } catch (error) {
      console.error(`✗ Failed to load controller from ${filePath}:`, error)
    }
  }
}
