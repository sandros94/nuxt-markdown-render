import type { Component } from 'vue'
import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'

export interface Config {
  as: string
  options: MarkdownItOptions
  components: Record<string, Component>
  plugins: PluginSimple[]
  forceHtml: boolean
}

export type MarkdownItOptions = MarkdownItOptions
export type PluginSimple = PluginSimple

export type MaybeRefPartial<T> = {
  [P in keyof T]?: T[P] | Ref<T[P]>
}
