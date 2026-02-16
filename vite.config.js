const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sluzby: resolve(__dirname, "sluzby.html"),
        nasiKone: resolve(__dirname, "nasi-kone.html"),
        akce: resolve(__dirname, "akce.html"),
        oNas: resolve(__dirname, "o-nas.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
      },
    },
  },
});
