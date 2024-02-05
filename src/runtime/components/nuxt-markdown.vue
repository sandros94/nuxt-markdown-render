<template>
  <!-- `inner-html` is to force an update of the element -->
  <NuxtMarkdown :inner-html="content" />
</template>

<script setup lang="ts">
import type {
  MarkdownItOptions,
  PluginSimple,
} from '../types'
import { toRefs } from 'vue'
import type { PropType, Component } from 'vue'
import { useNuxtMarkdown } from '../composables/use-nuxt-markdown'

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

const { rendered: NuxtMarkdown, content } = useNuxtMarkdown(source, {
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
</script>
