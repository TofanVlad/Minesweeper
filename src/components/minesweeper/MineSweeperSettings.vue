<script setup lang="ts">
import { computed, reactive, watch, watchEffect } from "vue";
import useMineSweeper, {
  boardSize,
  gameDifficulty,
  numberOfMines,
} from "../../composables/useMineSweeper";
import { EventBusEvents } from "../../constants/events";
import { eventBus } from "../../utils/eventBus";
import Input from "../Input.vue";
import Radio from "../Radio.vue";

export type GameType = keyof typeof difficultyList;

defineProps<{ active: boolean }>();

const { resetGame } = useMineSweeper();

const MAX_ALLOWED_BOARD_SIZE = 20;

const difficultyList = Object.freeze({
  Easy: { boardSize: 6, numberOfMines: 8 },
  Medium: { boardSize: 8, numberOfMines: 18 },
  Hard: { boardSize: 12, numberOfMines: 36 },
});

const gameOptions = reactive({
  boardSize: boardSize.value,
  numberOfMines: numberOfMines.value,
});

const maxAllowedMineCount = computed(() => gameOptions.boardSize ** 2 - 1);
const areInputsActive = computed(() => gameDifficulty.value === "Custom");

function updateLocalGameOptions(gameType: string) {
  gameOptions.boardSize = difficultyList[gameType as GameType].boardSize;
  gameOptions.numberOfMines = difficultyList[gameType as GameType].numberOfMines;
  gameDifficulty.value = gameType;
}

function updateGameOptions() {
  boardSize.value = gameOptions.boardSize;
  numberOfMines.value = gameOptions.numberOfMines;
  resetGame();
}

watchEffect(() => {
  if (gameOptions.numberOfMines > maxAllowedMineCount.value) {
    gameOptions.numberOfMines = maxAllowedMineCount.value;
  }

  if (gameOptions.boardSize < 1) gameOptions.boardSize = 1;
  if (gameOptions.numberOfMines < 1) gameOptions.numberOfMines = 1;

  if (gameOptions.boardSize > MAX_ALLOWED_BOARD_SIZE) {
    gameOptions.boardSize = MAX_ALLOWED_BOARD_SIZE;
  }
});

watch(gameDifficulty, (value) => {
  if (value === "Custom") return;
  updateLocalGameOptions(value);
});

eventBus.on(EventBusEvents.saveGameOptions, updateGameOptions);
</script>

<template>
  <Transition>
    <section
      v-if="active"
      class="flex flex-col absolute w-full h-full p-4 bg-body border-l-bleeq border-t-bleeq border-b-shadow border-r-shadow border-[6px] overflow-y-scroll"
    >
      <p class="mt-auto mb-auto text-3xl font-semibold tracking-widest text-center">SETTINGS</p>
      <div class="flex gap-4 mt-2 mb-4">
        <Radio
          v-for="item in Object.keys(difficultyList)"
          :key="item"
          :title="item"
          :active="item === gameDifficulty"
          v-model="gameDifficulty"
        />
      </div>
      <Radio title="Custom" v-model="gameDifficulty" :active="areInputsActive" />
      <div class="flex gap-2 mt-2 mb-auto">
        <Input title="Board" v-model="gameOptions.boardSize" :active="areInputsActive" />
        <Input title="Mines" v-model="gameOptions.numberOfMines" :active="areInputsActive" />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
section::-webkit-scrollbar {
  display: none;
}
section {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.v-enter-active,
.v-leave-active {
  transition: transform 0.75s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(100%);
}
</style>
