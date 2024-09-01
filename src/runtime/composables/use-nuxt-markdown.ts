import { computed, ref, toValue } from 'vue'
import type { Ref, MaybeRefOrGetter } from 'vue'
import { defu } from 'defu'

import MarkdownIt from 'markdown-it'

import type { Config } from '../types'
import { useRuntimeConfig, useNuxtApp } from '#imports'

/**
 * The main composable to access or customize md, renderer and content.
 *
 * @param params - An object containing the following properties:
 * - `disable` - The markdown-it rules to disable
 * - `enable` - The markdown-it rules to enable
 * - `new` - Whether to use a blank markdown-it instance
 * - `options` - The markdown-it options
 * - `plugins` - The markdown-it plugins
 * - `source` - The markdown source string
 *
 * @returns an object with the following properties:
 * - `blank` - whether a new md instance is used
 * - `content` - the rendered markdown content
 * - `md` - a blank markdown-it instance
 */
export const useNuxtMarkdown = (params?: { source?: MaybeRefOrGetter<string | undefined> } & Config) => {
  const { source, ...paramsRest } = params ?? {}
  const { $md } = useNuxtApp()

  const {
    plugins: {
      mdc,
    },
    useNuxtLink,
    vueRuntimeCompiler,
  } = useRuntimeConfig().public.nuxtMarkdownRender

  const configDef = defu<Config, Config[]>(paramsRest, {
    disable: undefined,
    enable: undefined,
    new: false,
    options: undefined,
    plugins: undefined,
    useNuxtLink,
  })

  // Check if a new istance is required
  const newRequired = computed(() => !!(configDef.new || configDef.disable || configDef.enable || configDef.plugins || paramsRest.options))

  // TODO: Add support to optionally inherit from nuxt config
  const md: Ref<MarkdownIt> = ref<MarkdownIt>(newRequired.value ? new MarkdownIt(configDef.options ?? {}) : $md)

  if (mdc !== false && useNuxtLink && vueRuntimeCompiler && newRequired) {
    md.value.renderer.rules.link_open = function (tokens, idx, options, env, slf) {
      const token = tokens[idx]
      token.attrs = token.attrs && token.attrs.map((attr) => {
        if (attr[0] === 'href') attr[0] = 'to'
        return attr
      })
      return '<NuxtLink' + slf.renderAttrs(token) + '>'
    }
    md.value.renderer.rules.link_close = function () {
      return '</NuxtLink>'
    }
  }

  if (configDef.enable) {
    md.value.enable(configDef.enable, true)
  }

  if (configDef.disable) {
    md.value.disable(configDef.disable, true)
  }

  if (configDef.plugins) {
    for (const plugin of configDef.plugins) {
      md.value.use(plugin)
    }
  }

  const content = computed(() => md.value.render(toValue(source) ?? ''))

  return {
    blank: newRequired,
    content,
    md,
  }
}
