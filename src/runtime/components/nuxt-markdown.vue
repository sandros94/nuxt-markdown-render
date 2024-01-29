<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'
import { compile, h } from 'vue'
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

const { config, content, vueRuntimeCompiler } = useNuxtMarkdown(props.source, {
  options: props.options,
  plugins: props.plugins,
})

const NuxtMarkdown = () => {
  if (props.forceHtml || !vueRuntimeCompiler) {
    return h(config.as, { innerHTML: content.value, })
  } else {
    return h({
      components: props.components,
      render: compile(content.value),
    })
  }
}
</script>
