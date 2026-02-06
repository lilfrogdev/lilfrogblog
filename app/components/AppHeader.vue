<script setup lang="ts">
const router = useRouter();

const isMobileSearchOpen = ref(false);
const mobileSearchQuery = ref("");

function toggleMobileSearch() {
  isMobileSearchOpen.value = !isMobileSearchOpen.value;
  if (!isMobileSearchOpen.value) {
    mobileSearchQuery.value = "";
  }
}

function submitMobileSearch() {
  if (mobileSearchQuery.value.trim()) {
    isMobileSearchOpen.value = false;
    router.push({ path: "/", query: { search: mobileSearchQuery.value } });
    mobileSearchQuery.value = "";
  }
}
</script>
<template>
  <div>
    <header
      class="flex items-center justify-between py-4 mb-8 border-b dark:border-gray-700"
    >
      <NuxtLink
        to="/"
        class="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400"
      >
        lilfrogdev
      </NuxtLink>
      <div class="flex items-center gap-4">
        <div class="hidden md:block">
          <SearchBar />
        </div>
        <button
          class="block md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-200 dark:bg-gray-700': isMobileSearchOpen }"
          aria-label="Toggle search"
          @click="toggleMobileSearch"
        >
          <Icon v-if="!isMobileSearchOpen" name="lucide:search" size="24" />
          <Icon v-else name="lucide:x" size="24" />
        </button>
        <a
          href="https://github.com/lilfrogdev"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Github profile"
        >
          <Icon name="lucide:github" size="24" />
        </a>
        <ColorModeToggle />
      </div>
    </header>
    <div v-if="isMobileSearchOpen" class="mb-6 md:hidden">
      <div class="relative">
        <Icon
          name="lucide:search"
          size="18"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="mobileSearchQuery"
          type="text"
          placeholder="Search posts..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keydown.enter="submitMobileSearch"
        />
      </div>
    </div>
  </div>
</template>
