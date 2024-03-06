![nuxt-markdown-render](https://raw.githubusercontent.com/sandros94/nuxt-markdown-render/main/docs/public/nuxt-markdown-render_cover.png)

# nuxt-markdown-render

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Much inspired by [vue-markdown-render](https://github.com/cloudacy/vue-markdown-render), this Nuxt module is a simple and lightweight wrapper for [markdown-it](https://markdown-it.github.io/) with full TypeScript support.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- TODO: following links -->
<!-- - [🏀 Online playground](https://stackblitz.com/github/sandros94/nuxt-markdown-render?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ✨ &nbsp;Ease of use
- 🔋 &nbsp;Battery included ([mdc](https://github.com/antfu/markdown-it-mdc), [shiki](https://github.com/antfu/markdown-it-mdc), [anchor](https://github.com/valeriangalliat/markdown-it-anchor), [link-attrbs](https://github.com/crookedneighbor/markdown-it-link-attributes), [GitHub Alerts](https://github.com/antfu/markdown-it-github-alerts))
- 🧩 &nbsp;Extensible via markdown-it plugins
- 🎨 &nbsp;Customizable (both via `runtimeConfig` as well as via `props`)
- 📘 &nbsp;TypeScript support

## How to use it

```vue
<template>
  <div>
    <NuxtMarkdown :source="md" :components="{ MyComponent }" />
  </div>
</template>

<script setup>
import { MyComponent } from '#components'

const md = `
# Hello Nuxt!

Welcome to the example of [nuxt-markdown-render](https://github.com/sandros94/nuxt-markdown-render).

:MyComponent`
</script>

```

checkout the [MDC (Markdown Components)](https://content.nuxt.com/usage/markdown) documentation on how to use components within markdown files.

## Quick Setup

1. Add `nuxt-markdown-render` dependency to your project
    ```bash
    # Using pnpm
    pnpm add -D nuxt-markdown-render
    
    # Using yarn
    yarn add --dev nuxt-markdown-render
    
    # Using npm
    npm install --save-dev nuxt-markdown-render
    ```

2. Add `nuxt-markdown-render` to the `modules` section of `nuxt.config.ts`
    ```ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-markdown-render'
      ]
    })
    ```

3. (**OPTIONAL**) Customize your defaults via `nuxtMarkdownRender` inside your `nuxt.config.ts`
    ```ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-markdown-render'
      ],
    
      nuxtMarkdownRender: {
        as: 'article', // default 'div'
        component: 'NotNuxtMarkdown', // false to disable Nuxt's auto import
        options: {
          html: false // default true
        },
        plugins: {
          mdc: false // default mdc options object
          anchor: {
            level: 2 // default 1
          }
        }
        vueRuntimeCompiler: false // default true
      }
    })
    ```
    This will configure the following:
    - render them as [`article`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article) HTML tags.
    - change the component name to `NotNuxtMarkdown`.
    - disable [HTML tags in source](https://markdown-it.github.io/markdown-it/#MarkdownIt.new).
    - disable the builit-in [mdc](https://github.com/antfu/markdown-it-mdc) plugin.
    - disable vue's [`runtimeCompiler`](https://nuxt.com/docs/api/nuxt-config#runtimecompiler).

## Using Plugins

There are two main ways to use `markdown-it` plugins, the first is made for simple plugins, passed as an array to the `NuxtMarkdown` component's props. The second is to create your own `NuxtMarkdown` component of advanced use cases.

### Basic plugins
Simply import them and pass them as an array for the `plugins` prop.
```vue
<template>
  <div>
    <NuxtMarkdown :source="md" :plugins="[emoji]" />
  </div>
</template>

<script setup>
import { full as emoji } from 'markdown-it-emoji'

const md = `my markdown content`
</script>
```

### Advanced Plugins
Some plugins, such asynchronous ones, do require to be handled directly by `useNuxtMarkdown` composable. This requires you to completelly overriding the `NuxtMarkdown` component with your own custom one.

1. start by disabling the builtin `NuxtMarkdown` component from `nuxt.config.ts`:
    ```ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-markdown-render'
      ],
      nuxtMarkdownRender: {
        component: false
      },
    })
    ```

2. Create your own `~/components/NuxtMarkdown.vue`, with the following structure (substitute plugins with the desired ones):
    ```vue
    <template>
      <NuxtMarkdown />
    </template>

    <script setup lang="ts">
    // import installed plugins
    import anchor from 'markdown-it-anchor'
    import shiki from '@shikijs/markdown-it'
    import mdcPlugin from 'markdown-it-mdc'

    // Import your other components
    import { Alert, Grid } from '#components'

    const props = defineProps({
      source: {
        type: String,
        required: true,
      },
    })

    const { rendered: NuxtMarkdown, md } = useNuxtMarkdown(props.source, {
      components: {
        Alert,
        Grid
      },
      plugins: [
        await shiki({
          themes: {
            light: 'vitesse-light',
            dark: 'vitesse-dark'
          }
        }),
        mdcPlugin
      ],
    })

    md.value.use(anchor, { level: 2 })
    </script>
    ```

3. Use this new `NuxtMarkdown` component with all the plugins already configured.

That's it! You can now use `nuxt-markdown-render` module in your Nuxt app ✨

### `useNuxtMarkdown` exports

The following are the available exports for `useNuxtMarkdown` composable.

```ts
const {
  config,    // configs in use, currently for debuging purposes
  content,   // rendered content from markdown-it
  md,        // main parser/renderer
  rendered,  // rendered vue component based on `content`
} = useNuxtMarkdown(source, configs)
```

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test
pnpm run test:watch

# Release new version
pnpm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-markdown-render/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-markdown-render

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-markdown-render.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-markdown-render

[license-src]: https://img.shields.io/npm/l/nuxt-markdown-render.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-markdown-render

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
