<template>
  <div>
    <NuxtMarkdown :source="md" :components="{ TestComponent }" />
  </div>
</template>

<script setup>
import { NuxtMarkdown, TestComponent } from '#components'

const md = `# Nuxt module playground!

Welcome to the example of <a href="https://github.com/sandros94/nuxt-markdown-render" target="_blank">nuxt-markdown-render</a>.

<TestComponent/>
<GlobalComponent/>`
</script>
