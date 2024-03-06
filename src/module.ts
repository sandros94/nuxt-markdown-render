import {
  defineNuxtModule,
  addComponent,
  addImports,
  createResolver
} from '@nuxt/kit'
import type { Options as MarkdownItOptions } from 'markdown-it'
import type { MarkdownItMdcOptions } from 'markdown-it-mdc'
import type { MarkdownItGitHubAlertsOptions } from 'markdown-it-github-alerts'
import type { MarkdownItShikiOptions } from '@shikijs/markdown-it'
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
  global: boolean | 'sync'
  options: MarkdownItOptions
  plugins: {
    githubAlerts: false | MarkdownItGitHubAlertsOptions
    mdc: false | MarkdownItMdcOptions
    shiki: false | MarkdownItShikiOptions
    anchor: false | {
      level?: number | number[]
      uniqueSlugStartIndex?: number
      tabIndex?: number | false
    }
    toc: false | {
      includeLevel?: number[]
      containerClass?: string
      markerPattern?: RegExp
      listType?: 'ol' | 'ul'
      containerHeaderHtml?: string
      containerFooterHtml?: string
    }
  }
  /**
   * Enable vue runtime compiler. Required to render components via plugins such markdown-it-mdc.
   * @default true
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
    component: 'NuxtMarkdown',
    composable: 'useNuxtMarkdown',
    global: false,
    options: {},
    plugins: {
      githubAlerts: {},
      mdc: {},
      shiki: {
        themes: {
          light: 'github-light',
          dark: 'github-dark'
        }
      },
      anchor: {},
      toc: {}
    },
    vueRuntimeCompiler: true
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    const nuxtMarkdownOptions = nuxt.options.runtimeConfig.public.nuxtMarkdownRender = defu(
      nuxt.options.runtimeConfig.public.nuxtMarkdownRender,
      {
        as: options.as,
        component: options.component,
        composable: options.composable,
        global: options.global,
        options: options.options,
        plugins: {
          githubAlerts: options.plugins.githubAlerts,
          mdc: options.plugins.mdc,
          shiki: options.plugins.shiki,
          anchor: options.plugins.anchor,
          toc: options.plugins.toc
        },
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
