<script setup lang="ts">
import { computed } from "vue";
import useMineSweeper from "../../composables/useMineSweeper";
const { isGameWon, isGameOver, openSettings } = useMineSweeper();

const icon = computed(() => {
  if (!isGameOver.value && !isGameWon.value && !openSettings.value) return "🙂";
  if (isGameOver.value && !isGameWon.value && !openSettings.value) return "😵";
  if (isGameOver.value && isGameWon.value && !openSettings.value) return "😎";
  if (openSettings.value) return "🤔";
});
</script>
<template>
  <button
    class="flex items-center justify-center gap-2 text-white active:border-b-bleeq active:border-r-bleeq active:border-t-shadow active:border-b-[8px] active:border-r-[8px] active:border-l-shadow outline outline-[2px] outline-shadow transition-all bg-body border-[10px] border-b-shadow border-r-shadow border-l-bleeq border-t-bleeq max-w-[84px] text-4xl w-full h-full aspect-square select-none"
  >
    {{ icon }}
  </button>
</template>
