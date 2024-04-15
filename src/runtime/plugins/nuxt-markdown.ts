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
    md.value.use((await import('markdown-it-mdc')).default, mdc)
  if (githubAlerts !== false)
    md.value.use((await import('markdown-it-github-alerts')).default, githubAlerts)
  if (anchor !== false)
    md.value.use((await import('markdown-it-anchor')).default, anchor)
  if (shiki !== false && shiki !== undefined){
    const shikiPlugin = (await import('@shikijs/markdown-it')).default
    md.value.use(await shikiPlugin(shiki))
  }
  return {
    provide: {
      md
    }
  }
})
