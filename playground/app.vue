<template>
  <div>
    <NuxtMarkdown
      :source="md"
      :options="{ html: true }"
    />
  </div>
</template>

<script setup>
const md = `
# Nuxt module playground!

Welcome to the example of <a href="https://github.com/sandros94/nuxt-markdown-render" target="_blank">nuxt-markdown-render</a>.`
</script>
