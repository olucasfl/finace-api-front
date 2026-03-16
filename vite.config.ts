import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "apple-touch-icon.png"
      ],

      manifest: {
        name: "Smart Finance",
        short_name: "Finance",
        description: "Controle inteligente de finanças",

        theme_color: "#0f172a",
        background_color: "#0f172a",

        display: "standalone",
        orientation: "portrait",

        start_url: "/dashboard",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          }
        ]
      }
    })
  ],

  build: {

    target: "esnext",

    sourcemap: false,

    minify: "esbuild",

    chunkSizeWarningLimit: 1000,

    rollupOptions: {

      output: {

        manualChunks: {

          react: ["react","react-dom"],

          router: ["react-router-dom"]

        }

      }

    }

  },

  optimizeDeps: {

    include: [
      "react",
      "react-dom",
      "react-router-dom"
    ]

  },

  server: {

    port: 5173

  }

})