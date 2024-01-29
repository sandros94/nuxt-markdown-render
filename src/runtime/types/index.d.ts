import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'

export interface Config {
  as: string
  options: MarkdownItOptions
  plugins: PluginSimple[]
  forceHtml: boolean
}
