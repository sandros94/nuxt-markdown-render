<template>
  <!-- `inner-html` is to force an update of the element -->
  <NuxtMarkdown :inner-html="content" />
</template>

<script setup lang="ts">
import type {
  MarkdownItOptions,
  PluginSimple,
} from '../types'
import type { ModuleOptions } from '../../module'
import { toRefs } from 'vue'
import type { PropType, Component } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useNuxtMarkdown } from '../composables/use-nuxt-markdown'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import mdcPlugin from 'markdown-it-mdc'
import shiki from '@shikijs/markdown-it'
import anchor from 'markdown-it-anchor'

const {
    plugins: {
      githubAlerts: githubAlertsOptions,
      mdc: mdcOptions,
      shiki: shikiOptions,
      anchor: anchorOptions
    }
  } = useRuntimeConfig().public.nuxtMarkdownRender as ModuleOptions

const props = defineProps({
  as: {
    type: String,
    required: false,
    default: undefined,
  },
  components: {
    type: Object as PropType<Record<string, Component>>,
    required: false,
    default: () => ({}),
  },
  forceHtml: {
    type: Boolean,
    required: false,
    default: false,
  },
  options: {
    type: Object as PropType<MarkdownItOptions>,
    required: false,
    default: () => ({}),
  },
  plugins: {
    type: Array as PropType<PluginSimple[]>,
    required: false,
    default: () => [],
  },
  source: {
    type: String,
    required: true,
  },
})

const {
  components,
  forceHtml,
  source
}= toRefs(props)

const { rendered: NuxtMarkdown, content, md } = useNuxtMarkdown(source, {
  as: props.as,
  components,
  forceHtml,
  options: props.options,
  plugins: props.plugins,
})

defineExpose({
  content,
  NuxtMarkdown,
})


if (githubAlertsOptions !== false)
  md.value.use(MarkdownItGitHubAlerts, githubAlertsOptions)
if (mdcOptions !== false)
  md.value.use(mdcPlugin, mdcOptions)
if (shikiOptions !== false && shikiOptions !== undefined)
  md.value.use(await shiki(shikiOptions))
if (anchorOptions !== false)
  md.value.use(anchor, anchorOptions)
</script>
