<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(`post-${route.path}`, () =>
  queryCollection("blog").path(route.path).first(),
);

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
});

const tocLinks = computed(() => {
  if (!post.value?.body?.toc?.links) return [];

  const links: { id: string; text: string; depth: number }[] = [];

  function extractLinks(items: any[], depth = 2) {
    items.forEach((item) => {
      if (depth <= 3) {
        links.push({
          id: item.id,
          text: item.text,
          depth,
        });
        if (item.children) {
          extractLinks(item.children, depth + 1);
        }
      }
    });
  }

  extractLinks(post.value.body.toc.links);
  return links;
});

const isTocOpen = ref(false);
</script>

<template>
  <article v-if="post">
    <div class="mb-8 -mx-4 sm:mx-0">
      <img
        :src="post.image"
        :alt="post.title"
        class="w-full aspect-[2/1] object-cover sm:rounded-lg"
      />
    </div>
    <div class="lg:hidden mb-8">
      <button
        @click="isTocOpen = !isTocOpen"
        class="flex items-center justify-between w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <span class="font-medium">Table of Contents</span>
        <Icon :name="isTocOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
      </button>
      <div
        v-if="isTocOpen"
        class="mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <TableOfContents :links="tocLinks" />
      </div>
    </div>
    <div class="lg:flex lg:gap-8">
      <div class="lg:flex-1 min-w-0">
        <header class="mb-8">
          <NuxtLink
            to="/"
            class="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to posts
          </NuxtLink>
          <h1 class="text-4xl font-bold mb-2">{{ post.title }}</h1>
          <div class="text-gray-600 dark:text-gray-400 mb-4">
            {{
              new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="{ path: '/', query: { tag } }"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </header>

        <ContentRenderer
          :value="post"
          class="prose dark:prose-invert max-w-none"
        />
      </div>

      <aside class="hidden lg:block lg:w-64 flex-shrink-0">
        <div class="sticky top-8">
          <TableOfContents :links="tocLinks" />
        </div>
      </aside>
    </div>
  </article>
</template>
