<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type { NuxtMarkdownExpose, NuxtMarkdownProps } from '../types'
import { useNuxtMarkdown, useRuntimeConfig } from '#imports'
import { h, toRefs, getCurrentInstance } from 'vue'
import { NuxtLink } from '#components'
import { defu } from 'defu'

const {
  as: defaultAs,
  plugins: {
    mdc,
  },
  useNuxtLink,
  vueRuntimeCompiler,
} = useRuntimeConfig().public.nuxtMarkdownRender
const globalComponents = getCurrentInstance()?.appContext.components

const props = defineProps<NuxtMarkdownProps>()

const configDef = defu({
  as: props.as,
  components: props.components,
}, {
  as: defaultAs,
  components: { ...globalComponents },
})

if (mdc !== false && useNuxtLink && vueRuntimeCompiler) {
  configDef.components = { ...configDef.components, NuxtLink }
}

const { blank, content, md } = useNuxtMarkdown({
  source: toRefs(props).source,
  new: props.new,
  options: props.options,
  plugins: props.plugins,
})

const NuxtMarkdown = () => {
  if (!vueRuntimeCompiler) {
    return h(configDef.as, { innerHTML: content.value, })
  } else {
    return h(configDef.as, [
      h({
        components: configDef.components,
        template: content.value,
      })
    ])
  }
}

defineExpose<NuxtMarkdownExpose>({
  blank,
  content,
  md,
})
</script>
