import {
  defineNuxtModule,
  addComponent,
  addImports,
  createResolver
} from '@nuxt/kit'
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
  options: MarkdownItOptions
  /**
   * Component's default name.
   * 
   * @default 'NuxtMarkdown'
   */
  component: string | false
  /**
   * Composable's default name.
   * 
   * @default 'useNuxtMarkdown'
   */
  composable: string | false
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
    options: {},
    component: 'NuxtMarkdown',
    composable: 'useNuxtMarkdown',
    vueRuntimeCompiler: false
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    const nuxtMarkdownOptions = nuxt.options.runtimeConfig.public.nuxtMarkdownRender = defu(
      nuxt.options.runtimeConfig.public.nuxtMarkdownRender,
      {
        as: options.as,
        options: options.options,
        component: options.component,
        composable: options.composable,
        vueRuntimeCompiler: options.vueRuntimeCompiler
      }
    )

    if (nuxtMarkdownOptions.vueRuntimeCompiler)
      nuxt.options.vue.runtimeCompiler = true

    if (nuxtMarkdownOptions.composable !== false)
      addImports({
        as : nuxtMarkdownOptions.composable,
        from: resolve(runtimeDir, 'composables', 'use-nuxt-markdown'),
        name: 'useNuxtMarkdown'
      })
    
    if (nuxtMarkdownOptions.component !== false)
      addComponent({
        filePath: resolve(runtimeDir, 'components', 'nuxt-markdown'),
        global: options.global,
        name: nuxtMarkdownOptions.component
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
