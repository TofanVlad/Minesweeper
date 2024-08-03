<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { MineSweeperCell } from "../../types";
import { maxAllowedFlags, isGameOver, isGameStarted } from "../../composables/useMineSweeper";
import { EventBusEvents } from "../../constants/events";
import { eventBus } from "../../utils/eventBus";

const numberColors = Object.freeze({
  1: "text-blue-400",
  2: "text-green-400",
  3: "text-red-400",
  4: "text-violet-400",
  5: "text-orange-400",
  6: "text-teal-400",
  7: "text-gray-400",
  8: "text-black",
}) as Record<number, string>;

const props = defineProps<MineSweeperCell>();

const isRevealed = defineModel("isRevealed");
const isFlagged = defineModel("isFlagged");

//! We need emit to avoid gameData recreation during composable call
const emit = defineEmits<{
  (e: "revealAllEmptyNeighbors", cell: MineSweeperCell): void;
}>();

function flagCell() {
  if (isFlagged.value == false && maxAllowedFlags.value === 0) return;
  isFlagged.value = !isFlagged.value;
  // If the cell is already flagged, increment the maxAllowedFlags value by 1, otherwise decrement it by 1
  maxAllowedFlags.value = isFlagged.value ? maxAllowedFlags.value + 1 : maxAllowedFlags.value - 1;
}

function revealCell() {
  if (isFlagged.value === true) return;

  isRevealed.value = true;

  if (props.counter == 0 && !props.isMine) {
    emit("revealAllEmptyNeighbors", props);
  }

  if (props.isMine) {
    isGameOver.value = true;
    eventBus.emit(EventBusEvents.gameOver);
    return;
  }

  if (!isGameStarted.value) {
    isGameStarted.value = true;
    eventBus.emit(EventBusEvents.gameStart);
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center w-12 text-3xl transition-colors border-4 shadow cursor-pointer select-none aspect-square active:bg-revealed active:border-none border-l-bleeq border-t-bleeq border-b-shadow border-r-shadow"
    :class="{
      'bg-revealed !border-2 !border-b-0 !border-r-0 !border-l-shadow !border-t-shadow pointer-events-none':
        isRevealed && !isFlagged,
      '!bg-red-400': isRevealed && isMine,
      '!bg-[#883333] !border-t-[#BB6666] !border-l-[#BB6666] !border-b-[#661111] !border-r-[#661111]':
        !isRevealed && !isMine && isGameOver && isFlagged,
      'pointer-events-none': isGameOver,
    }"
    v-if="props"
    @click="revealCell"
    @contextmenu.prevent="flagCell"
  >
    <Icon
      v-if="isMine"
      icon="mdi:mine"
      class="text-black"
      :class="{ hidden: !isGameOver || (isGameOver && isFlagged) }"
    />
    <Icon v-if="isFlagged && !isRevealed" icon="material-symbols:flag" class="text-red-500" />

    <template v-if="isRevealed && !isMine">
      <p class="font-bold" :class="numberColors[props.counter]">
        {{ props.counter > 0 ? props.counter : "" }}
      </p>
    </template>
  </div>
</template>
