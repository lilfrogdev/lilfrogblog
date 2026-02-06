<script setup lang="ts">
interface TocLink {
  id: string;
  text: string;
  depth: number;
}

const props = defineProps<{
  links: TocLink[];
}>();

const activeId = ref<string>("");

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: "-100px 0px -80% 0px",
    },
  );

  props.links.forEach((link) => {
    const el = document.getElementById(link.id);
    if (el) observer.observe(el);
  });

  onUnmounted(() => observer.disconnect());
});

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
</script>
<template>
  <nav class="toc">
    <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
      Table of Contents
    </h3>
    <ul class="space-y-2">
      <li v-for="link in links" :key="link.id" :class="{ 'ml-4': link.depth === 3 }">
        <button @click="scrollToHeading(link.id)"
          class="text-left text-sm transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400" :class="[
            activeId === link.id
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-600 dark:text-gray-400',
          ]">
          {{ link.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
