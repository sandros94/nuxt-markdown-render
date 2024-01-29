export default defineNuxtConfig({
  alias: {
    'nuxt-markdown-render': '../src/module'
  },
  modules: ['nuxt-markdown-render'],
  nuxtMarkdownRender: {
    options: {
      html: true,
      linkify: true,
      xhtmlOut: true,
    }
  },
  devtools: { enabled: true }
})
