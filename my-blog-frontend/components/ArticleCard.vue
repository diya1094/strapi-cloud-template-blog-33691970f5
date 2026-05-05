<script setup lang="ts">
const config = useRuntimeConfig()

const props = defineProps<{
  article: {
    id: number
    title: string
    slug: string
    excerpt?: string
    publishedAt: string
    cover?: { url: string; alternativeText?: string } | null
  }
}>()

const coverUrl = computed(() => {
  const url = props.article.cover?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
})

const formattedDate = computed(() =>
  new Date(props.article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)
</script>

<template>
  <NuxtLink :to="`/blog/${article.slug}`" class="article-card">
    <div class="card-image-wrap">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="article.cover?.alternativeText || article.title"
        class="card-cover"
        loading="lazy"
      />
      <div v-else class="card-placeholder" aria-hidden="true">✍️</div>
    </div>
    <div class="card-body">
      <time class="card-date">{{ formattedDate }}</time>
      <h2 class="card-title">{{ article.title }}</h2>
      <p v-if="article.excerpt" class="card-excerpt">{{ article.excerpt }}</p>
      <span class="card-read-more">Read more →</span>
    </div>
  </NuxtLink>
</template>
