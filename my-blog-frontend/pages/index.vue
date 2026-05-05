<script setup lang="ts">
const config = useRuntimeConfig()

const { data: articles, pending, error } = await useFetch(
  `${config.public.strapiUrl}/api/articles`,
  {
    query: {
      'populate': 'cover',
      'sort': 'publishedAt:desc',
    },
    transform: (res: any) => res.data ?? [],
  }
)

useHead({
  title: 'My Blog',
  meta: [
    { name: 'description', content: 'A blog powered by Strapi & Nuxt' },
  ],
})
</script>

<template>
  <main class="container">
    <header class="site-header">
      <h1>My Blog</h1>
      <p>Thoughts, articles &amp; ideas.</p>
    </header>

    <div v-if="pending" class="loading">Loading articles…</div>
    <div v-else-if="error" class="error">Failed to load articles. Is Strapi running?</div>
    <div v-else-if="!articles?.length" class="empty">
      No articles yet. Add some in the Strapi admin panel.
    </div>

    <div v-else class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </main>
</template>
