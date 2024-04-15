import { type Ref, ref } from 'vue'

import MarkdownIt from 'markdown-it'

import { defineNuxtPlugin } from '#app'
import type { ModuleOptions } from '../../module'

export default defineNuxtPlugin(async nuxtApp => {
  const {
    disable,
    enable,
    options,
    plugins: {
      githubAlerts,
      mdc,
      shiki,
      anchor
    },
    useNuxtLink,
    vueRuntimeCompiler
  } = nuxtApp.$config.public.nuxtMarkdownRender as ModuleOptions

  const md: Ref<MarkdownIt> = ref<MarkdownIt>(new MarkdownIt(options))

  if (mdc !== false && useNuxtLink && vueRuntimeCompiler) {
    md.value.renderer.rules.link_open = function (tokens, idx, options, env, slf) {
      const token = tokens[idx]
      token.attrs = token.attrs && token.attrs.map(attr => {
        if (attr[0] === 'href') attr[0] = 'to'
        return attr
      })
      return '<NuxtLink' + slf.renderAttrs(token) + '>'
    }
    md.value.renderer.rules.link_close = function () { return '</NuxtLink>' }
  }

  if (enable) {
    md.value.enable(enable, true)
  }

  if (disable) {
    md.value.disable(disable, true)
  }

  if (mdc !== false && vueRuntimeCompiler)
    md.value.use((await import('markdown-it-mdc').catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error('[nuxt-markdown-render]: `markdown-it-mdc` is an optional dependency for handling Markdown Components and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, mdc)
  if (githubAlerts !== false)
    md.value.use((await import('markdown-it-github-alerts').catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error('[nuxt-markdown-render]: `markdown-it-github-alerts` is an optional dependency to support Github styled Alerts and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, githubAlerts)
  if (anchor !== false)
    md.value.use((await import('markdown-it-anchor').catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error('[nuxt-markdown-render]: `markdown-it-anchor` is an optional dependency that adds id and other functionalities to headings and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, anchor)
  if (shiki !== false && shiki !== undefined){
    const shikiPlugin = (await import('@shikijs/markdown-it').catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error('[nuxt-markdown-render]: `@shikijs/markdown-it` is an optional dependency that provide powerful syntax highlight and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default
    md.value.use(await shikiPlugin(shiki))
  }
  return {
    provide: {
      md
    }
  }
})
