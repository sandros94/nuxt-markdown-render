<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type {
  MarkdownItOptions,
  PluginSimple,
} from '../types'
import type { PropType, Component } from 'vue'
import { useNuxtMarkdown } from '#imports'

const props = defineProps({
  as: {
    type: String,
    required: false,
    default: undefined,
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
})

const { rendered } = useNuxtMarkdown(props.source, {
  options: props.options,
  plugins: props.plugins,
})

const NuxtMarkdown = rendered
</script>
