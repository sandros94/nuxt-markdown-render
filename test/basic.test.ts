import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders markdown content', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<h1 id="nuxt-module-playground!" tabindex="-1">Nuxt module playground!</h1><p>Welcome to the example of <a href="https://github.com/sandros94/nuxt-markdown-render" target="_blank">nuxt-markdown-render</a>.</p><div><h1>Test component</h1></div>')
  })
})
