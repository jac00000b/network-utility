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
        tags: [
          {
            injectTo: "head",
            tag: "link",
            attrs: {
              rel: "preconnect",
              href: "https://loc.jacob.com.hk",
            },
          },
          //@ts-expect-error
          ...dohServers.map((server) => ({
            injectTo: "head",
            tag: "link",
            attrs: {
              rel: "preconnect",
              href: new URL(server.url).origin,
            },
          })),
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
