import type { Component } from 'vue'
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
  new: boolean
  options?: MarkdownItOptions
  plugins?: PluginSimple[]
  useNuxtLink: boolean
}

export type MarkdownItOptions = MarkdownItOptions
export type PluginSimple = PluginSimple
