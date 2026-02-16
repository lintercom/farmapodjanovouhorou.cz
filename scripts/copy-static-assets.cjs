const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const foldersToCopy = ["migration_export", "img"];

for (const folderName of foldersToCopy) {
  const sourcePath = path.join(rootDir, folderName);
  const targetPath = path.join(distDir, folderName);

  if (!fs.existsSync(sourcePath)) continue;

  fs.cpSync(sourcePath, targetPath, {
    recursive: true,
    force: true,
  });
}
