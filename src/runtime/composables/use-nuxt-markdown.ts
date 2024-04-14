import MarkdownIt from 'markdown-it'
import { compile, computed, h, ref, toValue } from 'vue'
import type { Ref, MaybeRefOrGetter } from 'vue'
import { defu } from 'defu'
import { useRuntimeConfig, useNuxtApp } from '#imports'
import type { Config, DeepMROG } from '../types'

/**
 * The main composable to access or customize md, renderer and content.
 * 
 * @param overrides - An object containing the following properties:
 * - `as` - The HTML tag name for the component
 * - `components` - The components to render
 * - `forceHtml` - Whether to force HTML rendering
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
export const useNuxtMarkdown = (overrides?: { source?: MaybeRefOrGetter<string | undefined> } & DeepMROG<Config>) => {

  const { source, ...overridesRest } = overrides ?? {}
  const { $md } = useNuxtApp()

  const {
    as: defaultAs,
    vueRuntimeCompiler,
  } = useRuntimeConfig().public.nuxtMarkdownRender

  const configDef = defu<Config, Config[]>(overridesRest, {
    as: defaultAs,
    options: {},
    components: {},
    plugins: [],
    forceHtml: false
  })

  // TODO: Add support to optionally inherit from global config
  const md: Ref<MarkdownIt> = ref<MarkdownIt>(new MarkdownIt(configDef.options))

  if (configDef.plugins) {
    for (const plugin of toValue(configDef.plugins)) {
      md.value.use(plugin)
    }
  }

  const content = computed(() => $md.value.render(toValue(source) ?? ''))

  const rendered = () => {
    if (toValue(configDef.forceHtml) || !vueRuntimeCompiler) {
      return h(configDef.as, { innerHTML: content.value, })
    } else {
      return h(configDef.as, [
        h({
          components: toValue(configDef.components),
          render: compile(content.value),
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
    rendered
  }
}
