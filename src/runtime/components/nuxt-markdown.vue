<template>
  <NuxtMarkdownRenderer v-bind="rendererProps" :source="content" />
</template>

<script setup lang="ts">
import { reactivePick } from '@vueuse/core'
import { toRefs } from 'vue'
import type { NuxtMarkdownExpose, NuxtMarkdownProps } from '../types'
import { NuxtMarkdownRenderer } from '#components'
import { useNuxtMarkdown } from '#imports'

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
