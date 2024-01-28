<script lang="ts" setup>
import { paginationMeta } from "@/utils/usePaginationMeta";

defineProps({
  store: {
    required: true,
  },
});
</script>

<template>
  <VCardText class="mt-4">
    <VRow class="d-flex justify-space-between" :style="{ padding: '10px' }">
      <div class="d-flex gap-2">
        <VSelect
          v-model="store.meta.per_page"
          class="w-25"
          :items="[10, 20, 30]"
          label="Per Page"
          placeholder="Select per page"
          type="text"
        />
      </div>

      <div>
        <p
          class="d-flex text-sm text-disabled mt-6"
          :style="{ 'align-items': 'center' }"
        >
          {{ paginationMeta(store.meta, store.meta.total) }}
        </p>
      </div>

      <div class="d-flex mt-4">
        <VPagination
          v-if="store.meta.total > 0"
          v-model="store.meta.current_page"
          :total-visible="$vuetify.display.smAndDown ? 3 : 5"
          :length="Math.ceil(store.meta.total / store.meta.per_page)"
        >
          <template #prev="slotProps">
            <VBtn
              variant="tonal"
              color="default"
              v-bind="slotProps"
              :icon="false"
            >
              Previous
            </VBtn>
          </template>
          <template #next="slotProps">
            <VBtn
              variant="tonal"
              color="default"
              v-bind="slotProps"
              :icon="false"
            >
              Next
            </VBtn>
          </template>
        </VPagination>
      </div>
    </VRow>
  </VCardText>
</template>
