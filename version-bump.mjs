import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";

const PATCH = "patch";
const MINOR = "minor";
const MAJOR = "major";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const writeJson = (path, payload, space) => {
  writeFileSync(path, `${JSON.stringify(payload, null, space)}\n`);
};

const runCommand = (command) => {
  execSync(command, { stdio: "inherit" });
};

const bumpVersion = (version, bumpType) => {
  const parts = version.split(".").map((segment) => Number(segment));
  if (
    parts.length !== 3 ||
    parts.some((segment) => !Number.isInteger(segment) || segment < 0)
  ) {
    throw new Error(`Invalid version format: ${version}`);
  }

  const [major, minor, patch] = parts;
  if (bumpType === PATCH) {
    return `${major}.${minor}.${patch + 1}`;
  }

  if (bumpType === MAJOR) {
    return `${major + 1}.0.0`;
  }

  return `${major}.${minor + 1}.0`;
};

const askBumpType = async () => {
  const rl = createInterface({ input, output });
  try {
    while (true) {
      const answer = (
        await rl.question(
          "Select version bump type [patch/minor/major] (default: minor): ",
        )
      )
        .trim()
        .toLowerCase();

      if (answer === PATCH) {
        return PATCH;
      }

      if (answer === "" || answer === MINOR) {
        return MINOR;
      }

      if (answer === MAJOR) {
        return MAJOR;
      }

      output.write(
        "Invalid choice. Please enter 'patch', 'minor', or 'major'.\n",
      );
    }
  } finally {
    rl.close();
  }
};

const main = async () => {
  const packageJson = readJson("package.json");
  const currentVersion = packageJson.version;
  const bumpType = await askBumpType();
  const targetVersion = bumpVersion(currentVersion, bumpType);

  packageJson.version = targetVersion;
  writeJson("package.json", packageJson, 2);

  const manifest = readJson("manifest.json");
  const { minAppVersion } = manifest;
  manifest.version = targetVersion;
  writeJson("manifest.json", manifest, "\t");

  const versions = readJson("versions.json");
  versions[targetVersion] = minAppVersion;
  writeJson("versions.json", versions, "\t");

  runCommand("npm install");
  runCommand(
    "git add package.json package-lock.json manifest.json versions.json",
  );
  runCommand(
    `git commit -m \"chore: bump version to ${targetVersion}\" -- package.json package-lock.json manifest.json versions.json`,
  );
  runCommand(`git tag \"${targetVersion}\"`);

  output.write(`Bumped version ${currentVersion} -> ${targetVersion}\n`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
