<script setup lang="ts">
import MineSweeper from "./components/minesweeper/MineSweeper.vue";
import { gameResetKey } from "./composables/useMineSweeper";
</script>

<template>
  <MineSweeper :key="gameResetKey" />
</template>
