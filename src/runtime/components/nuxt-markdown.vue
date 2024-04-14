<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { toRefs } from 'vue'
import type { Config } from '../types'
import { useNuxtMarkdown } from '../composables/use-nuxt-markdown'

interface Props extends Partial<Omit<Config, 'components'>> {
  components: Record<string, Component>
  source?: string
}

const props = defineProps<Props>()

const {
  components,
  forceHtml,
  source
}= toRefs(props)

const { rendered: NuxtMarkdown, content, $md, md, newRequired } = useNuxtMarkdown({
  source,
  as: props.as,
  components,
  forceHtml,
  new: props.new,
  options: props.options,
  plugins: props.plugins,
})

defineExpose({
  content,
  md: newRequired ? md : $md,
  NuxtMarkdown,
})
</script>
