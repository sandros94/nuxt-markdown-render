import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'

export interface Config {
  disable?: string | string[]
  enable?: string | string[]
  new: boolean
  options?: MarkdownItOptions
  plugins?: PluginSimple[]
  useNuxtLink: boolean
}

export type MarkdownItOptions = MarkdownItOptions
export type PluginSimple = PluginSimple
