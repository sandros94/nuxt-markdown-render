import { defineNuxtPlugin } from '#app'
import { type Ref, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import mdcPlugin from 'markdown-it-mdc'
import shikiPlugin from '@shikijs/markdown-it'
import anchorPlugin from 'markdown-it-anchor'
import type { ModuleOptions } from '../../module'

export default defineNuxtPlugin(async nuxtApp => {
  const {
    options,
    plugins: {
      githubAlerts,
      mdc,
      shiki,
      anchor
    },
    vueRuntimeCompiler
  } = nuxtApp.$config.public.nuxtMarkdownRender as ModuleOptions

  const md: Ref<MarkdownIt> = ref<MarkdownIt>(new MarkdownIt(options))

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
