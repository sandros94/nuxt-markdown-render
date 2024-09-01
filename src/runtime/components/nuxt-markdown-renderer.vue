<template>
  <NuxtMarkdownRenderer v-bind="props" />
</template>

<script setup lang="ts">
import { h, getCurrentInstance } from 'vue'
import { defu } from 'defu'
import type { NuxtMarkdownRendererProps } from '../types'
import { useRuntimeConfig } from '#imports'
import { NuxtLink } from '#components'

const {
  as: defaultAs,
  plugins: {
    mdc,
  },
  useNuxtLink: useLink,
  vueRuntimeCompiler,
} = useRuntimeConfig().public.nuxtMarkdownRender
const globalComponents = getCurrentInstance()?.appContext.components

const props = defineProps<NuxtMarkdownRendererProps>()

const configDef = defu({
  as: props.as,
  useNuxtLink: props.useNuxtLink,
  components: props.components,
}, {
  as: defaultAs,
  useNuxtLink: useLink,
  components: { ...globalComponents },
})

if (mdc !== false && configDef.useNuxtLink && vueRuntimeCompiler) {
  configDef.components = { ...configDef.components, NuxtLink }
}

const NuxtMarkdownRenderer = () => {
  if (!vueRuntimeCompiler) {
    return h(configDef.as, { innerHTML: props.source })
  }
  else {
    return h(configDef.as, [
      h({
        components: configDef.components,
        template: props.source,
      }),
    ])
  }
}
</script>
