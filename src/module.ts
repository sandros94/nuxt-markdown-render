import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'
import type { Options as MarkdownItOptions } from 'markdown-it'
import defu from 'defu'
import { fileURLToPath } from 'url'

export interface ModuleOptions {
  /**
   * HTML tag name for the component.
   * 
   * @default 'div'
   */
  as: string
  /**
   * Component's default name.
   * 
   * @default 'NuxtMarkdown'
   */
  componentName: string
  options: MarkdownItOptions
  /**
   * @default false
   */
  global?: boolean | 'sync'
  /**
   * Enable vue runtime compiler. Required to render components via plugins such markdown-it-mdc.
   * @default false
   */
  vueRuntimeCompiler: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-markdown-render',
    configKey: 'nuxtMarkdownRender',
    compatibility: {
      nuxt: '^3.5.0'
    }
  },
  defaults: {
    as: 'div',
    componentName: 'NuxtMarkdown',
    options: {},
    vueRuntimeCompiler: false
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.runtimeConfig.public.nuxtMarkdownRender = defu(
      nuxt.options.runtimeConfig.public.nuxtMarkdownRender,
      {
        as: options.as,
        options: options.options,
        vueRuntimeCompiler: options.vueRuntimeCompiler
      }
    )

    if (nuxt.options.runtimeConfig.public.nuxtMarkdownRender.vueRuntimeCompiler) {
      nuxt.options.vue.runtimeCompiler = true
    }

    addComponent({
      name: options.componentName,
      filePath: resolve(runtimeDir, 'components', 'nuxt-markdown.vue'),
      global: options.global
    })
  }
})

declare module '@nuxt/schema' {
  interface NuxtOptions {
    nuxtMarkdownRender?: ModuleOptions;
    runtimeConfig: {
      public: {
        nuxtMarkdownRender: ModuleOptions;
      };
    };
  }
}
