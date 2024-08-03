<script setup lang="ts">
import { shallowRef } from "vue";
import useMineSweeper, { maxAllowedFlags } from "../../composables/useMineSweeper";
import { EventBusEvents } from "../../constants/events";
import { eventBus } from "../../utils/eventBus";
import Counter from "../Counter.vue";
import MineSweeperButton from "./MineSweeperButton.vue";

const { resetGame } = useMineSweeper();
const timer = shallowRef(0);

let timerInterval: number;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timer.value = 0;
  timerInterval = setInterval(() => {
    if (timer.value === 999) {
      clearInterval(timerInterval);
      return;
    }
    timer.value++;
  }, 1000);
}

eventBus.on(EventBusEvents.gameStart, startTimer);
eventBus.on(EventBusEvents.gameOver, () => clearInterval(timerInterval));
</script>

<template>
  <div
    class="border-l-shadow border-t-shadow border-b-bleeq border-r-bleeq border-[6px] p-2 flex items-center gap-2 justify-between h-28"
  >
    <Counter :count="maxAllowedFlags" />
    <MineSweeperButton @click="resetGame" />
    <Counter :count="timer" />
  </div>
</template>
