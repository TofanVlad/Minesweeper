<script setup lang="ts">
const props = defineProps<{ count: string | number }>();

const addZeroInFront = () => {
  let num = props.count.toString();
  while (num.length < 3) num = "0" + num;
  return num;
};
</script>

<template>
  <div
    :counter="addZeroInFront()"
    class="text-6xl leading-[68px] text-[#400000] border-4 border-b-bleeq border-r-bleeq border-t-shadow border-l-shadow bg-black font-counter relative before:w-full before:content-[attr(counter)] before:h-full before:top-0 before:left-0 before:text-6xl before:leading-[68px] before:text-[#CC0000] before:absolute before:px-[4px] before:pt-[6px] select-none px-[4px] pt-[6px] w-[128px]"
  >
    888
  </div>
</template>
