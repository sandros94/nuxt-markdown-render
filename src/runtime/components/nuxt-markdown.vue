<template>
  <NuxtMarkdownRenderer v-bind="rendererProps" :source="content" />
</template>

<script setup lang="ts">
import type { NuxtMarkdownExpose, NuxtMarkdownProps } from '../types'
import { NuxtMarkdownRenderer } from '#components'
import { reactivePick } from '@vueuse/core'
import { useNuxtMarkdown } from '#imports'
import { toRefs } from 'vue'

const props = defineProps<NuxtMarkdownProps>()
const rendererProps = reactivePick(props, 'as', 'components', 'useNuxtLink')

const { blank, content, md } = useNuxtMarkdown({
  new: props.new,
  options: props.options,
  plugins: props.plugins,
  source: toRefs(props).source,
  useNuxtLink: props.useNuxtLink,
})

defineExpose<NuxtMarkdownExpose>({
  blank,
  content,
  md,
})
</script>
