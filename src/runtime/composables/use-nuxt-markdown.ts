import MarkdownIt from 'markdown-it'
import { defu } from 'defu'
import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import type { Config } from '../types'

/**
 * A composable that accepts a markdown string and returns the rendered HTML.
 * 
 * @param source required
 * @param config 
 */
export const useNuxtMarkdown = (source: string, config?: Partial<Config>) => {
  
  const {
    as: defaultAs,
    options: defaultOptions,
    vueRuntimeCompiler,
  } = useRuntimeConfig().public.nuxtMarkdownRender

  const configDef = defu<Config, Config[]>(config, {
    as: defaultAs,
    options: defaultOptions,
    plugins: [],
    forceHtml: false
  })

  const md = ref<MarkdownIt>(new MarkdownIt(configDef.options))

  for (const plugin of configDef.plugins) {
    md.value.use(plugin)
  }

  const content = computed(() => md.value.render(source))

  return {
    config: configDef,
    content,
    vueRuntimeCompiler
  }
}
