<template>
  <NuxtMarkdown />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { Config } from '../types'
import { useNuxtMarkdown, useRuntimeConfig } from '#imports'
import { h, toRefs, getCurrentInstance } from 'vue'
import { NuxtLink } from '#components'
import { defu } from 'defu'

interface Props extends Partial<Config> {
  as?: string
  components?: Record<string, Component>
  source?: string
}

const {
  as: defaultAs,
  plugins: {
    mdc,
  },
  useNuxtLink,
  vueRuntimeCompiler,
} = useRuntimeConfig().public.nuxtMarkdownRender
const globalComponents = getCurrentInstance()?.appContext.components

const props = defineProps<Props>()

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

const { content, md } = useNuxtMarkdown({
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

defineExpose({
  content,
  md,
})
</script>
