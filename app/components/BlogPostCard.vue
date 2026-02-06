<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  path?: string;
  image?: string;
}>();
</script>

<template>
  <article
    class="border rounded-lg overflow-hidden dark:border-gray-700 hover:shadow-lg transition-shadow"
  >
    <NuxtLink :to="path" class="flex flex-col sm:flex-row">
      <div class="sm:w-64 flex-shrink-0">
        <img
          :src="image"
          :alt="title"
          class="w-full h-48 sm:h-full object-cover aspect-[2/1]"
        />
      </div>
      <div class="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h2
            class="text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {{ title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ description }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="{ path: '/', query: { tag } }"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              @click.stop
            >
              {{ tag }}
            </NuxtLink>
          </div>
          <time class="text-sm text-gray-500 dark:text-gray-500">
            {{
              new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }}
          </time>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
