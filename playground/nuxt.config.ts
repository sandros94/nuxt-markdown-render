export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtMarkdownRender: {
    options: {
      html: true,
      linkify: true,
      xhtmlOut: true,
    }
  },
  devtools: { enabled: true }
})
