import type { Component, ComputedRef, Ref } from 'vue'
import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'
import type MarkdownIt from 'markdown-it'

export interface Config {
  disable?: string | string[]
  enable?: string | string[]
  new?: boolean
  options?: MarkdownItOptions
  plugins?: PluginSimple[]
  useNuxtLink?: boolean
}

export interface NuxtMarkdownRendererProps extends Pick<Config, 'useNuxtLink'> {
  as?: string
  components?: Record<string, Component>
  source?: string
}

export type NuxtMarkdownProps = NuxtMarkdownRendererProps & Config

export interface NuxtMarkdownExpose {
  blank: Ref<boolean>
  content: ComputedRef<string>
  md: Ref<MarkdownIt>
}

export type MarkdownItOptions = MarkdownItOptions
export type PluginSimple = PluginSimple
