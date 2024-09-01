import MarkdownIt from 'markdown-it'

import type { ModuleOptions } from '../../module'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    disable,
    enable,
    options,
    plugins: {
      githubAlerts,
      mdc,
      shiki,
      anchor,
    },
    useNuxtLink,
    vueRuntimeCompiler,
  } = nuxtApp.$config.public.nuxtMarkdownRender as ModuleOptions

  const md: MarkdownIt = new MarkdownIt(options)

  if (mdc !== false && useNuxtLink && vueRuntimeCompiler) {
    md.renderer.rules.link_open = function (tokens, idx, options, env, slf) {
      const token = tokens[idx]
      token.attrs = token.attrs && token.attrs.map((attr) => {
        if (attr[0] === 'href') attr[0] = 'to'
        return attr
      })
      return '<NuxtLink' + slf.renderAttrs(token) + '>'
    }
    md.renderer.rules.link_close = function () {
      return '</NuxtLink>'
    }
  }

  if (enable) {
    md.enable(enable, true)
  }

  if (disable) {
    md.disable(disable, true)
  }

  if (mdc !== false && vueRuntimeCompiler)
    md.use((await import('#nuxt-markdown-render/mdc').catch((err: any) => {
      console.error('[nuxt-markdown-render]: `markdown-it-mdc` is an optional dependency for handling Markdown Components and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, mdc)
  if (githubAlerts !== false)
    md.use((await import('#nuxt-markdown-render/github-alerts').catch((err: any) => {
      console.error('[nuxt-markdown-render]: `markdown-it-github-alerts` is an optional dependency to support Github styled Alerts and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, githubAlerts)
  if (anchor !== false)
    // @ts-ignore untyped
    md.use((await import('#nuxt-markdown-render/anchor').catch((err: any) => {
      console.error('[nuxt-markdown-render]: `markdown-it-anchor` is an optional dependency that adds id and other functionalities to headings and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default, anchor)
  if (shiki !== false && shiki !== undefined) {
    const shikiPlugin = (await import('#nuxt-markdown-render/shiki').catch((err: any) => {
      console.error('[nuxt-markdown-render]: `@shikijs/markdown-it` is an optional dependency that provide powerful syntax highlight and is not properly installed. Please check your `package.json` or install it again.')
      throw new Error(err)
    })).default
    md.use(await shikiPlugin(shiki))
  }

  return {
    provide: {
      md,
    },
  }
})
