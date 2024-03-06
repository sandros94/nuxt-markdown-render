<template>
  <div style="width: 100%; height: 90svh; display: inline-flex; gap: 8%;">
    <textarea
      v-model="md"
      @input="autoGrow"
    />
    <NuxtMarkdown
      :source="md"
      :components="{ TestComponent }"
    />
  </div>
</template>

<script setup>
import { TestComponent } from '#components'
const md = ref(`# Nuxt module playground!

Welcome to the example of <a href="https://github.com/sandros94/nuxt-markdown-render" target="_blank">nuxt-markdown-render</a>.

<TestComponent/>`)

const autoGrow = (event) => {
  event.target.style.height = 'auto'
  event.target.style.height = event.target.scrollHeight + 'px'
}
</script>

<style scoped>
nuxt-markdown {
  flex-basis: 55%;
  max-height: 100%;
  overflow-y: auto;
}

textarea {
  flex-basis: 45%;
  min-height: 50px;
  max-height: 100%;
  overflow-y: auto;
  resize: none;
}
</style>
