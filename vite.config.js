const { resolve } = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig(({ command }) => ({
  // Local dev runs from "/", GitHub Pages build runs from repo subpath.
  base: command === "serve" ? "/" : "/farmapodjanovouhorou.cz/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
}));
