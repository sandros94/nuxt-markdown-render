<template>
  <div>
    <NuxtMarkdown :source="md" />
  </div>
</template>

<script setup>
const md = `
# Markdown!

This is a markdown example.`
</script>
