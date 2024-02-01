<script lang="ts" setup>
import LeadsStatusesTable from "@/components/leads/StatusesTable.vue";
import { EventBus } from "@/utils/useEventBus";

const isAddLeadStatusDialogVisible: any = ref(false);

onMounted(() => {
  EventBus.$on("lead-status-selected", () => {
    isAddLeadStatusDialogVisible.value = true;
  });
});

onUnmounted(() => EventBus.$off("lead-status-selected"));
</script>
<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard class="leads-card">
          <VCardTitle class="pl-4 pr-4 mt-3 mb-2">
            <VRow class="text-layout">
              <VCol cols="6" class="text-left">
                <h6 class="text-h5">Leads Statuses Table</h6>
              </VCol>
              <VCol cols="6" class="text-right">
                <VBtn
                  @click="isAddLeadStatusDialogVisible = true"
                  color="primary"
                >
                  Create Lead Status
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>

          <LeadsStatusesTable />
        </VCard>
      </VCol>
    </VRow>
  </section>

  <AddEditLeadStatusDialog
    v-model:is-lead-status-dialog-visible="isAddLeadStatusDialogVisible"
  />
</template>
