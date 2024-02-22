<script setup lang="ts">
import { EventBus } from "@/utils/useEventBus";

const visible = ref(false);
const items = ref();

onMounted(() => {
  EventBus.$on("view-lightbox", (imgs: any) => {
    items.value = imgs;
    visible.value = true;
  });
});

onUnmounted(() => EventBus.$off("view-lightbox"));
</script>

<template>
  <VueEasyLightbox :visible="visible" :imgs="items" @hide="visible = false" />
</template>
