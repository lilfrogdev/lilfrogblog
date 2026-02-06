<script setup lang="ts">
const router = useRouter();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const searchContainer = ref<HTMLElement | null>(null);

const { data: allPosts } = await useAsyncData("search-posts", () =>
  queryCollection("blog")
    .select("title", "path", "tags")
    .order("date", "DESC")
    .all(),
);

const searchResults = computed(() => {
  if (!allPosts.value || searchQuery.value.length < 3) return [];

  const query = searchQuery.value.toLowerCase();
  return allPosts.value
    .filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)),
    )
    .slice(0, 3);
});

watch(searchResults, (results) => {
  isDropdownOpen.value = results.length > 0;
});

function goToPost(path: string) {
  isDropdownOpen.value = false;
  searchQuery.value = "";
  router.push(path);
}

function submitSearch() {
  if (searchQuery.value.trim()) {
    isDropdownOpen.value = false;
    router.push({ path: "/", query: { search: searchQuery.value } });
  }
}

function handleClickOutside(event: MouseEvent) {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="searchContainer" class="relative">
    <div class="relative">
      <Icon name="lucide:search" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input v-model="searchQuery" type="text" placeholder="Search posts..."
        class="w-64 pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown.enter="submitSearch" />
    </div>

    <div v-if="isDropdownOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
      <button v-for="post in searchResults" :key="post.path"
        class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
        @click="goToPost(post.path)">
        {{ post.title }}
      </button>
    </div>
  </div>
</template>
