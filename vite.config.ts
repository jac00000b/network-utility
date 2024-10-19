import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { dohServers } from "./src/lib/utils";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    splitVendorChunkPlugin(),
    createHtmlPlugin({
      minify: true,
      entry: "src/main.tsx",
      inject: {
        tags: dohServers.map((server) => ({
          injectTo: "head",
          tag: "link",
          attrs: {
            rel: "dns-prefetch",
            href: new URL(server.url).origin.split(":")[0],
          },
        })),
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
