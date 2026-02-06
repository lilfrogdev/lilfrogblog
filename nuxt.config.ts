// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/seo",
    "@nuxt/icon",
  ],

  site: {
    url: "https://lilfrogdev.com",
    name: "lilfrogdev",
  },

  colorMode: {
    classSuffix: "",
  },

  routeRules: {
    "/": { prerender: true },
    "/blog/**": { prerender: true },
  },

  content: {
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3,
      },
    },
    database: {
      type: "sqlite",
      filename: ":memory:",
    },
  },
});
