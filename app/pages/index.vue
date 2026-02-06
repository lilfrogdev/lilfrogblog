<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const isMobileSearchOpen = ref(false);

const selectedTag = computed(() => {
  return route.query.tag as string | undefined;
});

const urlSearchQuery = computed(() => {
  return (route.query.search as string) || "";
});

const localSearchQuery = ref("");

watch(
  urlSearchQuery,
  (newVal) => {
    localSearchQuery.value = newVal;
  },
  { immediate: true },
);

function updateSearch() {
  const query: Record<string, string> = {};
  if (localSearchQuery.value) {
    query.search = localSearchQuery.value;
  }
  if (selectedTag.value) {
    query.tag = selectedTag.value;
  }
  router.replace({ path: "/", query });
}

function toggleMobileSearch() {
  isMobileSearchOpen.value = !isMobileSearchOpen.value;
}

defineExpose({ toggleMobileSearch, isMobileSearchOpen });

const { data: posts } = await useAsyncData("posts", () => {
  let query = queryCollection("blog")
    .select("title", "description", "date", "tags", "path", "image")
    .order("date", "DESC");

  if (selectedTag.value) {
    query = query.where("tags", "LIKE", `%${selectedTag.value}%`);
  }

  return query.all();
});

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  if (!urlSearchQuery.value) return posts.value;

  const search = urlSearchQuery.value.toLowerCase();
  return posts.value.filter(
    (post) =>
      post.title?.toLowerCase().includes(search) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(search)),
  );
});
</script>

<template>
  <div>
    <div v-if="isMobileSearchOpen" class="mb-6 md:hidden">
      <div class="relative">
        <Icon
          name="lucide:search"
          size="18"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="localSearchQuery"
          type="text"
          placeholder="Search posts..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          @input="updateSearch"
        />
      </div>
    </div>

    <div v-if="selectedTag || urlSearchQuery" class="mb-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Filtering by:
      </span>
      <NuxtLink
        v-if="selectedTag"
        :to="{ path: '/', query: { search: urlSearchQuery || undefined } }"
        class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
      >
        tag: {{ selectedTag }} &times;
      </NuxtLink>
      <NuxtLink
        v-if="urlSearchQuery"
        :to="{ path: '/', query: { tag: selectedTag || undefined } }"
        class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm"
      >
        search: {{ urlSearchQuery }} &times;
      </NuxtLink>
    </div>

    <div class="space-y-6">
      <BlogPostCard
        v-for="post in filteredPosts"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :tags="post.tags"
        :path="post.path"
        :image="post.image"
      />
    </div>

    <p v-if="filteredPosts?.length === 0" class="text-gray-500">
      No posts found.
    </p>
  </div>
</template>
