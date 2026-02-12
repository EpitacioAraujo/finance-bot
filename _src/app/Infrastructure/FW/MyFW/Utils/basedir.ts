import * as path from "path"

/**
 * Returns the path from MyFW root directory
 * @param relativePath - Path to concatenate to MyFW root
 * @returns Absolute path
 */
export function basedir(relativePath: string = ""): string {
  return path.resolve(__dirname, "../..", relativePath)
}
