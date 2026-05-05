<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const { data: article, error } = await useFetch(
  `${config.public.strapiUrl}/api/articles`,
  {
    query: {
      'filters[slug][$eq]': route.params.slug,
      'populate': 'cover',
    },
    transform: (res: any) => res.data?.[0] ?? null,
  }
)

// Redirect to 404 if article not found
if (!article.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead(() => ({
  title: article.value?.title ?? 'Post not found',
  meta: [{ name: 'description', content: article.value?.excerpt ?? '' }],
}))

const coverUrl = computed(() => {
  const url = article.value?.cover?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
})

const formattedDate = computed(() =>
  article.value
    ? new Date(article.value.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
)

// Render Strapi Blocks rich text to HTML
function renderBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block: any) => {
      const renderInline = (children: any[]) =>
        (children || [])
          .map((c: any) => {
            let t = (c.text ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            if (c.bold)      t = `<strong>${t}</strong>`
            if (c.italic)    t = `<em>${t}</em>`
            if (c.underline) t = `<u>${t}</u>`
            if (c.code)      t = `<code>${t}</code>`
            if (c.type === 'link') t = `<a href="${c.url}" target="_blank" rel="noopener">${t}</a>`
            return t
          })
          .join('')

      switch (block.type) {
        case 'heading':
          return `<h${block.level}>${renderInline(block.children)}</h${block.level}>`
        case 'paragraph':
          return `<p>${renderInline(block.children)}</p>`
        case 'list': {
          const tag = block.format === 'ordered' ? 'ol' : 'ul'
          const items = (block.children || [])
            .map((li: any) => `<li>${renderInline(li.children)}</li>`)
            .join('')
          return `<${tag}>${items}</${tag}>`
        }
        case 'code':
          return `<pre><code>${renderInline(block.children)}</code></pre>`
        case 'quote':
          return `<blockquote>${renderInline(block.children)}</blockquote>`
        case 'image':
          return block.image?.url
            ? `<img src="${block.image.url.startsWith('http') ? block.image.url : config.public.strapiUrl + block.image.url}" alt="${block.image.alternativeText || ''}" />`
            : ''
        default:
          return `<p>${renderInline(block.children)}</p>`
      }
    })
    .join('\n')
}
</script>

<template>
  <main class="container">
    <NuxtLink to="/" class="back-link">← Back to all posts</NuxtLink>

    <div v-if="error" class="error">Failed to load this post.</div>

    <article v-else-if="article" class="post">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="article.title"
        class="post-cover"
      />
      <time class="post-date">{{ formattedDate }}</time>
      <h1 class="post-title">{{ article.title }}</h1>
      <p v-if="article.excerpt" class="post-excerpt">{{ article.excerpt }}</p>
      <hr v-if="article.excerpt" class="post-divider" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="post-content" v-html="renderBlocks(article.content)" />
    </article>
  </main>
</template>
