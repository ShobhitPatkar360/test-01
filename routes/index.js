import { readdirSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

/**
 * @description This module automatically adds all the routes
 * @param {Object} app
 * @returns {Object} routeModules
 */

export default function (app) {
  // Get the current directory
  const currentDir = dirname(fileURLToPath(import.meta.url));

  // Create an object to store the loaded route modules
  const routeModules = {};

  // Read the files in the current directory
  const filesStack = [currentDir];

  while (filesStack.length > 0) {
    const currentPath = filesStack.pop();
    const files = readdirSync(currentPath);

    files.forEach((file) => {
      const filePath = join(currentPath, file);
      const isDirectory = statSync(filePath).isDirectory();

      if (file !== "index.js") {
        if (file.endsWith(".js")) {
          const moduleName = file.replace(".js", ""); // Extract module name without the .js extension
          import(pathToFileURL(filePath))
            .then((module) => {
              routeModules[moduleName] = module.default;
              app.use("/service", module.default);
            })
            .catch((error) => {
              console.error(
                `Error loading route module from file ${file}: ${error.message}`
              );
            });
        } else if (isDirectory) {
          // If it's a directory, load routes from it
          const nestedFiles = readdirSync(filePath);
          nestedFiles.forEach((nestedFile) => {
            if (nestedFile !== "index.js" && nestedFile.endsWith(".js")) {
              import(pathToFileURL(join(filePath, nestedFile)))
                .then((nestedModule) => {
                  routeModules[nestedFile.replace(".js", "")] = nestedModule.default;
                  app.use("/financial", nestedModule.default);
                })
                .catch((error) => {
                  console.error(
                    `Error loading nested route module from file ${nestedFile}: ${error.message}`
                  );
                });
            }
          });

          // Add nested directory to the stack for further processing
          filesStack.push(filePath);
        }
      }
    });
  }

  return routeModules;
}
