import { computed, h, ref, toValue, getCurrentInstance } from 'vue'
import type { Ref, MaybeRefOrGetter } from 'vue'
import { defu } from 'defu'

import MarkdownIt from 'markdown-it'

import { useRuntimeConfig, useNuxtApp } from '#imports'
import { NuxtLink } from '#components'
import type { Config } from '../types'

/**
 * The main composable to access or customize md, renderer and content.
 * 
 * @param overrides - An object containing the following properties:
 * - `as` - The HTML tag name for the component
 * - `components` - The components to render
 * - `disable` - The markdown-it rules to disable
 * - `enable` - The markdown-it rules to enable
 * - `forceHtml` - Whether to force HTML rendering
 * - `new` - Whether to use a blank markdown-it instance
 * - `options` - The markdown-it options
 * - `plugins` - The markdown-it plugins
 * - `source` - The markdown source string
 * 
 * @returns an object with the following properties:
 * - `config` - the current configuration
 * - `content` - the rendered markdown content
 * - `$md` - a globally available markdown-it instance
 * - `md` - a blank markdown-it instance
 * - `rendered` - the rendered Vnode
 */
export const useNuxtMarkdown = (overrides?: { source?: MaybeRefOrGetter<string | undefined> } & Partial<Config>) => {

  const { source, ...overridesRest } = overrides ?? {}
  const { $md } = useNuxtApp()

  const {
    as: defaultAs,
    plugins: {
      mdc,
    },
    useNuxtLink,
    vueRuntimeCompiler,
  } = useRuntimeConfig().public.nuxtMarkdownRender
  const globalComponents = getCurrentInstance()?.appContext.components

  const configDef = defu<Config, Config[]>(overridesRest, {
    as: defaultAs,
    components: { ...globalComponents },
    disable: undefined,
    enable: undefined,
    forceHtml: false,
    new: false,
    options: undefined,
    plugins: undefined,
    useNuxtLink
  })

  // TODO: Add support to optionally inherit from nuxt config
  const md: Ref<MarkdownIt> = ref<MarkdownIt>(new MarkdownIt(configDef.options ?? {}))

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

    configDef.components = {
      ...configDef.components,
      NuxtLink
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

  // Check if a new istance is required
  const newRequired = !!(configDef.new || configDef.disable || configDef.enable || configDef.plugins || overridesRest.options)

  const content = computed(() => {
    if (newRequired) {
      return md.value.render(toValue(source) ?? '')
    }
    else {
      return $md.value.render(toValue(source) ?? '')
    }
  })

  const rendered = () => {
    if (configDef.forceHtml || !vueRuntimeCompiler) {
      return h(configDef.as, { innerHTML: content.value, })
    } else {
      return h(configDef.as, [
        h({
          components: configDef.components,
          template: content.value,
        })
      ])
    }
  }

  const currentConfigs = computed(() => {
    return {
      ...configDef,
      vueRuntimeCompiler
    }
  })

  return {
    config: currentConfigs,
    content,
    $md,
    md,
    newRequired,
    rendered
  }
}
