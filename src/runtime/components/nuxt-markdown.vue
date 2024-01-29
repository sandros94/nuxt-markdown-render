<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import type {
  Options as MarkdownItOptions,
  PluginSimple,
} from 'markdown-it'
import { defu } from 'defu'
import { compile, computed, h, ref } from 'vue'
import type { PropType, Component } from 'vue'
import { useRuntimeConfig } from '#imports'

interface Config {
  as: string
  options: MarkdownItOptions
}

const {
  as: defaultAs,
  options: defaultOptions,
  vueRuntimeCompiler,
} = useRuntimeConfig().public.nuxtMarkdownRender

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

const config = defu<Config, Config[]>({
  as: props.as,
  options: props.options,
}, {
  as: defaultAs,
  options: defaultOptions,
})

const md = ref<MarkdownIt>(new MarkdownIt(config.options))

for (const plugin of props.plugins) {
  md.value.use(plugin)
}

const content = computed(() => md.value.render(props.source))

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
