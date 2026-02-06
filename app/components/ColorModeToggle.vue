<script setup lang="ts">
const colorMode = useColorMode();

function toggleColorMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <button
    @click="toggleColorMode"
    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
    aria-label="Toggle color mode"
  >
    <Icon v-if="colorMode.value == 'dark'" name="lucide:sun" size="24" />
    <Icon v-else name="lucide:moon" size="24" />
  </button>
</template>
