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

// GitHub Pages SPA fallback: copy index.html to 404.html so client-side routes work
const indexHtml = path.join(distDir, "index.html");
const notFoundHtml = path.join(distDir, "404.html");
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
}
