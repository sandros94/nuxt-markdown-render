<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { toRefs } from 'vue'
import type { Config } from '../types'
import { useNuxtMarkdown } from '../composables/use-nuxt-markdown'

interface Props extends Partial<Omit<Config, 'components'>> {
  components?: Record<string, Component>
  source?: string
}

const props = defineProps<Props>()

const {
  source
}= toRefs(props)

const { content, $md, md, blank, rendered: NuxtMarkdown } = useNuxtMarkdown({
  source,
  as: props.as,
  components: props.components,
  forceHtml: props.forceHtml,
  new: props.new,
  options: props.options,
  plugins: props.plugins,
})

defineExpose({
  content,
  md: blank ? md : $md,
  NuxtMarkdown,
})
</script>
