<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import { onMounted } from "vue";
import useMineSweeper, { boardSize } from "../../composables/useMineSweeper";
import { EventBusEvents } from "../../constants/events";
import { eventBus } from "../../utils/eventBus";
import Button from "../Button.vue";
import MineSweeperCell from "./MineSweeperCell.vue";
import MineSweeperHeader from "./MineSweeperHeader.vue";
import MineSweeperSettings from "./MineSweeperSettings.vue";

const { gameData, generateBoard, generateNeighbors, revealAllEmptyNeighbors, openSettings } =
  useMineSweeper();

const toggleSettings = () => {
  openSettings.value = !openSettings.value;
  if (!openSettings.value) eventBus.emit(EventBusEvents.saveGameOptions);
};

onMounted(() => {
  generateBoard();
  generateNeighbors();
});
</script>

<template>
  <main class="relative m-auto" :style="`--grid-cols: ${boardSize};`">
    <div
      class="w-max bg-body border-t-bleeq border-l-bleeq border-[6px] border-b-shadow border-r-shadow p-2 transition-[filter]"
    >
      <MineSweeperHeader />
      <section
        class="relative border-l-shadow border-t-shadow border-b-bleeq border-r-bleeq border-[6px] grid grid-cols justify-center mt-2 overflow-hidden custom-grid__template-columns"
      >
        <MineSweeperCell
          v-for="(item, index) in gameData"
          :key="index"
          v-bind="item"
          v-model:isRevealed="item.isRevealed"
          v-model:isFlagged="item.isFlagged"
          @revealAllEmptyNeighbors="revealAllEmptyNeighbors"
        />
        <MineSweeperSettings :active="openSettings" />
      </section>
      <Button class="w-full mt-4 !min-h-[56px]" @click="toggleSettings">
        <Icon
          v-show="!openSettings"
          icon="material-symbols:settings-outline-rounded"
          class="text-2xl"
        />
        <span v-show="openSettings">Save</span>
      </Button>
    </div>
  </main>
</template>

<style scoped>
.custom-grid__template-columns {
  grid-template-columns: repeat(var(--grid-cols), minmax(0, 48px));
}
</style>
