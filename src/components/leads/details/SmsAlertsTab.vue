<script lang="ts" setup>
import useTime from "@/composables/useTime";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";

const isDialogVisible = ref(false);
const leadStore = useLeadsStore();
const time = useTime();
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-cellphone-marker" class="text-disabled" />
      </template>

      <template #append>
        <div class="me-n3 mt-n2">
          <VCol cols="12">
            <VTooltip :disabled="leadStore.selectedLead.phone_number_formatted">
              <template #activator="{ props }">
                <div v-bind="props" class="d-inline-block">
                  <VBtn
                    :disabled="!leadStore.selectedLead.phone_number_formatted"
                    @click="isDialogVisible = true"
                    color="primary"
                  >
                    Send Customer an Alert
                  </VBtn>
                </div>
              </template>
              <span>
                This lead have invalid number, please fix it to allow sending
                text messages.
              </span>
            </VTooltip>
          </VCol>
        </div>
      </template>

      <VCardTitle>SMS Alerts History</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTable class="mt-4" fixed-header>
            <thead>
              <tr>
                <th class="text-uppercase">Content</th>
                <th class="text-uppercase">Sent At</th>
              </tr>
            </thead>
            <tbody class="text-high-emphasis">
              <tr v-if="leadStore.selectedLead.notifications.length < 1">
                <td
                  class="font-italic font-weight-medium text-center"
                  colspan="6"
                >
                  No records found.
                </td>
              </tr>
              <tr
                v-else
                v-for="(notification, index) in (leadStore.selectedLead.notifications as any)"
              >
                <td class="py-4">
                  <p class="mb-0 font-italic">
                    {{ notification?.data?.content ?? "NULL" }}
                  </p>
                </td>
                <td>
                  <p class="mb-0">
                    {{ time.formatDate(notification?.created_at) }}
                  </p>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <SendSMSDialog v-model:is-dialog-visible="isDialogVisible" />
</template>
