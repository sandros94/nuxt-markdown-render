import MarkdownIt from 'markdown-it'
import { compile, h } from 'vue'
import { defu } from 'defu'
import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import type { Config } from '../types'

/**
 * A composable that accepts a markdown string and returns the rendered HTML.
 * 
 * @param source required
 * @param config optional
 * 
 * @returns an object with rendered content, rendered HTML and current configs.
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
    components: {},
    plugins: [],
    forceHtml: false
  })

  const md = ref<MarkdownIt>(new MarkdownIt(configDef.options))

  for (const plugin of configDef.plugins) {
    md.value.use(plugin)
  }

  const content = computed(() => md.value.render(source))

  const rendered = () => {
    if (configDef.forceHtml || !vueRuntimeCompiler) {
      return h(configDef.as, { innerHTML: content.value, })
    } else {
      return h({
        components: configDef.components,
        render: compile(content.value),
      })
    }
  }

  return {
    config: configDef,
    content,
    rendered,
    vueRuntimeCompiler
  }
}
