import type { Component, MaybeRefOrGetter } from 'vue'
import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'

export interface Config {
  as: string
  components: Record<string, Component>
  forceHtml: boolean
  disable?: string | string[]
  enable?: string | string[]
  options: MarkdownItOptions
  plugins: PluginSimple[]
}

export type MarkdownItOptions = MarkdownItOptions
export type PluginSimple = PluginSimple

export type DeepMROG<T> = T extends object ? {
  [P in keyof T]?: MaybeRefOrGetter<T[P]>
} : MaybeRefOrGetter<T>
