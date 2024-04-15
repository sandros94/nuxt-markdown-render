import { type Ref, ref } from 'vue'

import MarkdownIt from 'markdown-it'
import mdcPlugin from 'markdown-it-mdc'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import shikiPlugin from '@shikijs/markdown-it'
import anchorPlugin from 'markdown-it-anchor'

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

  if (anchor !== false)
    md.value.use(anchorPlugin, anchor)
  if (githubAlerts !== false)
    md.value.use(MarkdownItGitHubAlerts, githubAlerts)
  if (mdc !== false && vueRuntimeCompiler)
    md.value.use(mdcPlugin, mdc)
  if (shiki !== false && shiki !== undefined)
    md.value.use(await shikiPlugin(shiki))

  return {
    provide: {
      md
    }
  }
})
