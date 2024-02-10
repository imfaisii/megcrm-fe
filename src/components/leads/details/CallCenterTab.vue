<script setup lang="ts">
import useTime from "@/composables/useTime";
import { useCallCentersStore } from "@/stores/call-center/useCallCentersStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import avatar1 from "@images/avatars/avatar-4.png";

const leadStore = useLeadsStore();
const store = useCallCentersStore();
const time = useTime();

const isDialogVisible = ref(false);
const totalCallsThreshold = 12;

const isThresholdReached = computed(
  () => leadStore.selectedLead.call_centers.length >= totalCallsThreshold
);

onMounted(async () => await store.fetchCallCenterStatuses());
</script>

<template>
  <VCard
    :title="`Calling Schedule (${leadStore.selectedLead.call_centers.length}/${totalCallsThreshold})`"
    class="pa-5"
  >
    <template #append>
      <div class="me-n3 mt-n2">
        <VCol cols="12">
          <VTooltip bottom :disabled="!isThresholdReached">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="d-inline-block">
                <VBtn
                  :disabled="isThresholdReached"
                  v-bind="props"
                  @click="isDialogVisible = true"
                  :color="isThresholdReached ? 'error' : 'primary'"
                >
                  Add a call
                </VBtn>
              </div>
            </template>
            <span>
              Only {{ totalCallsThreshold }} call entries are allowed per
              customer.
            </span>
          </VTooltip>
        </VCol>
      </div>
    </template>

    <VCardText>
      <VList lines="two" class="meeting-schedule-list card-list">
        <template #default>
          <VAlert clas="mb-3" border="start" color="info" variant="tonal">
            Once you have added a call record, you will not be able to delete or
            edit it.
          </VAlert>

          <VTable fixed-header>
            <thead>
              <tr>
                <th class="text-uppercase">Call No</th>
                <th class="text-uppercase">Details</th>
                <th class="text-uppercase">Comments</th>
                <th class="text-uppercase">Status</th>
              </tr>
            </thead>

            <tbody class="text-high-emphasis">
              <tr v-if="leadStore.selectedLead.call_centers < 1">
                <td
                  class="font-italic font-weight-medium text-center"
                  colspan="4"
                >
                  No records found.
                </td>
              </tr>
              <tr
                v-else
                v-for="(callRecord, index) in leadStore.selectedLead
                  .call_centers"
              >
                <td>
                  <p>#{{ index + 1 }}</p>
                </td>
                <td>
                  <div class="d-flex align-center my-3">
                    <VAvatar rounded :size="38" :image="avatar1" class="me-3" />

                    <div>
                      <VListItemTitle class="text-sm font-weight-medium mb-1">
                        Call with {{ leadStore.selectedLead.full_name }}
                      </VListItemTitle>

                      <VListItemSubtitle
                        class="text-xs text-no-wrap d-flex align-center"
                      >
                        <VIcon start :size="16" icon="mdi-calendar-blank" />
                        <span>
                          {{ time.formatDate(callRecord.created_at) }}
                        </span>
                      </VListItemSubtitle>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-button font-italic">
                    {{ callRecord.comments }}
                  </p>
                </td>
                <td>
                  <VChip
                    size="x-small"
                    color="primary"
                    :text="callRecord?.call_center_status?.name"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </template>
      </VList>
    </VCardText>
  </VCard>

  <AddCallRecordDialog
    v-model:is-dialog-visible="isDialogVisible"
    @on-dialog-close="isDialogVisible = false"
  />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5625rem;
}
</style>

<style lang="scss">
.meeting-schedule-list {
  .v-list-item__append {
    block-size: 100%;
  }
}
</style>
