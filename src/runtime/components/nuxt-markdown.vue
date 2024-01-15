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
import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { useRuntimeConfig } from '#imports'

interface Config {
  as: string
  options: MarkdownItOptions
  plugins: PluginSimple[]
}

const {
  as: defaultAs,
  options: defaultOptions,
  plugins: defaultPlugins,
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
})

const config = defu<Config, Config[]>({
  as: props.as,
  options: props.options,
  plugins: props.plugins,
}, {
  as: defaultAs,
  options: defaultOptions,
  plugins: defaultPlugins,
})

const md = ref<MarkdownIt>(new MarkdownIt(config.options))

for (const plugin of config.plugins) {
  md.value.use(plugin)
}

const content = computed(() => md.value.render(props.source))

const NuxtMarkdown = () => h(config.as, { innerHTML: content.value })
</script>