export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtMarkdownRender: {
    componentName: 'BlankNuxtMarkdown',
    options: {
      html: true,
      linkify: true,
      xhtmlOut: true,
    }
  },
  devtools: { enabled: true }
})
