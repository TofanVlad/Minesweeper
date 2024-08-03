<script setup lang="ts">
defineProps<{
  title: string;
  active: boolean;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <label :for="title" class="w-full">
    <input
      type="radio"
      name="difficulty"
      :checked="active"
      :id="title"
      :value="title"
      @input="emit('input', title)"
      @change="emit('update:modelValue', title)"
      class="hidden peer"
    />
    <div
      class="bg-body peer-checked:bg-revealed peer-checked:border-b-bleeq peer-checked:border-r-bleeq peer-checked:border-l-shadow peer-checked:border-t-shadow transition-colors border-l-bleeq border-t-bleeq peer-checked:text-bleeq border-b-shadow border-r-shadow border-[6px] w-full text-center text-xl py-2 cursor-pointer select-none"
    >
      {{ title }}
    </div>
  </label>
</template>
