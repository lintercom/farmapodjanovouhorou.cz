const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        tabory: resolve(__dirname, "tabory.html"),
        jizdy: resolve(__dirname, "jizdy.html"),
        nasiKone: resolve(__dirname, "nasi-kone.html"),
        galerie: resolve(__dirname, "galerie.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
      },
    },
  },
});
