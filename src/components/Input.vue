<script setup lang="ts">
defineProps<{ title: string; modelValue: number | undefined; active: boolean }>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <label :for="title" class="flex flex-col-reverse gap-[2px] w-full last:text-right">
    <input
      type="number"
      :id="title"
      :name="title"
      :value="modelValue"
      :disabled="!active"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-2 py-1 transition-all border-4 outline-none bg-revealed border-l-bleeq disabled:border-l-shadow disabled:border-t-shadow disabled:border-b-bleeq disabled:border-r-bleeq border-t-bleeq border-b-shadow border-r-shadow disabled:text-bleeq peer"
    />
    <p class="font-semibold tracking-wide transition-colors peer-disabled:text-bleeq">
      {{ title }}
    </p>
  </label>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
