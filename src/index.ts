import { promises } from "fs";
import { checkIfFileExists } from "./check-if-file-exists";
import { findKeyPaths } from "./find-key-paths";
import { editUsingPaths } from "./edit-using-paths";
import kleur from "kleur";

async function forceResolutions() {
  try {
    // Check if current platform is windows
    const isWindows = process.platform === "win32" ? true : false;

    // Get working directory
    const currentWorkingDirectory = process.cwd();

    const properSlash = isWindows ? "\\" : "/";

    // Construct default package lock json path
    const defaultPackageLockJsonPath = `${currentWorkingDirectory}${properSlash}package-lock.json`;

    // Construct default package json path
    const defaultPackageJsonPath = `${currentWorkingDirectory}${properSlash}package.json`;

    // Check if package lock json exists
    const packageLockJsonExists = await checkIfFileExists(
      defaultPackageLockJsonPath
    );

    // Check if package json exists
    const packageJsonExists = await checkIfFileExists(defaultPackageJsonPath);

    if (packageLockJsonExists && packageJsonExists) {
      // Read package json
      const packageJSON = await promises.readFile(defaultPackageJsonPath);

      // Read package lock json
      const packageLockJSON = await promises.readFile(
        defaultPackageLockJsonPath
      );

      // Parse package lock json
      let packageJSONContent = JSON.parse(packageJSON.toString());

      // Parse package lock json
      let packageLockJSONContent = JSON.parse(packageLockJSON.toString());

      // Use standalone resolutions file
      const resolutionsJsonPath = `${currentWorkingDirectory}${properSlash}package-resolutions.json`;
      const resolutionsJsonExists = await checkIfFileExists(resolutionsJsonPath);
      const resolutionsJson = resolutionsJsonExists
                              ? await promises.readFile( resolutionsJsonPath )
                              : undefined;
      const resolutionsObj = resolutionsJson 
                              ? JSON.parse(resolutionsJson.toString())
                              : undefined;

      // Map resolutions
      const resolutions = resolutionsObj ? resolutionsObj.resolutions
                        : packageJSONContent.resolutions;

      console.log(kleur.cyan("Applying forced resolutions"));

      if (resolutions) {
        // Iterate over all resolutions
        Object.keys(resolutions).forEach((resolution) => {

          // Regex to identify resolution
          const resolutionRegExp = new RegExp(`${resolution}$`)

          // Find paths of the resolutions
          const keyPaths = findKeyPaths(
            packageLockJSONContent,
            (key, currentPath, currentObjectToAnalyze) => {
              const testPath = [ ...currentPath, key ].join('.')
              return resolutionRegExp.test(testPath)
            }
          );

          // Modifications to be performed
          let modifications: any = {};

          // Iterate resolutions key paths
          keyPaths.forEach((keyPath) => {
            // Regex to identify dependencies key paths
            const dependenciesRegex = /\.dependencies\./g;

            // Regex identify if npm 7
            const packagesRegex = /packages\./g;

            // Regex identify of nested deps
            const packagesDepsRegex = /packages\.node_modules\/.*node_modules\/.*/g;

            // Regex to identify requires key paths
            const requiresRegex = /\.requires\./g;

            // Check the kind of key path and define modifications
            if (
              keyPath.match(dependenciesRegex) &&
              !keyPath.match(requiresRegex) &&
              !keyPath.match(packagesRegex)
            ) {
              // Change version
              modifications[`${keyPath}.version`] = resolutions[resolution];
              // Delete resolved
              modifications[`${keyPath}.resolved`] = undefined;

              // Delete integrity
              modifications[`${keyPath}.integrity`] = undefined;

              // Delete requires
              modifications[`${keyPath}.requires`] = undefined;

            }

            // Handle npm 7 package lock json format
            else if (!!keyPath.match(packagesRegex)) {

              if (!!keyPath.match(packagesDepsRegex)) {
                // Change version
                modifications[`${keyPath}.version`] = resolutions[resolution];
                // Delete resolved
                modifications[`${keyPath}.resolved`] = undefined;

                // Delete integrity
                modifications[`${keyPath}.integrity`] = undefined;

                // Delete requires
                modifications[`${keyPath}.requires`] = undefined;

                // Delete deprecated
                modifications[`${keyPath}.deprecated`] = undefined;

                // Delete dependencies
                modifications[`${keyPath}.dependencies`] = undefined;
              }
              else {
                // Change version
                modifications[keyPath] = resolutions[resolution];
              }
            }

            else if (!!keyPath.match(requiresRegex)) {
              // Change version on requires
              modifications[keyPath] = resolutions[resolution];

              // Create new dependencies object / edit it

              const packageDependenciesPath = keyPath.replace(
                "requires",
                "dependencies"
              );

              // Set version
              modifications[`${packageDependenciesPath}.version`] = resolutions[resolution];
              // Set resolved
              modifications[`${packageDependenciesPath}.resolved`] = undefined;

              // Set integrity
              modifications[`${packageDependenciesPath}.integrity`] = undefined;

              // Set requires
              modifications[`${packageDependenciesPath}.requires`] = undefined;
            }
          });

          // Edit the file and set changes
          packageLockJSONContent = editUsingPaths(
            packageLockJSONContent,
            modifications
          );

          console.log(kleur.dim(`${resolution} => ${resolutions[resolution]}`));
          // console.log(modifications)
          
          modifications = {};
        });

        // Write final processed file
        await promises.writeFile(
          defaultPackageLockJsonPath,
          JSON.stringify(packageLockJSONContent, null, 2)
        );
        console.log(
          kleur.green("Finished applying forced resolutions")
        );
      }
    }
  } catch (error) {
    console.log(
      kleur.red("An unexpected error has occurred while running force-resolutions")
    );
    console.error(error);
  }
}

forceResolutions().then();
