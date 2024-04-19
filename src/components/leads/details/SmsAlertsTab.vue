<script lang="ts" setup>
import useApiFetch from "@/composables/useApiFetch";
import useTime from "@/composables/useTime";
import { useToast } from "@/plugins/toastr";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";

const isDialogVisible = ref(false);
const leadStore: any = useLeadsStore();
const time = useTime();
const $toast = useToast();
const sendingSMS = ref(false);

const sendSmsWithTemplate = async (templateId: number, leadId: number) => {
  try {
    sendingSMS.value = true;
    await useApiFetch(`/send-sms/${leadId}/${templateId}`);

    $toast.success("Your message was sent.");
  } catch (e) {
  } finally {
    sendingSMS.value = false;
  }
};
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-cellphone-check" class="text-disabled" />
      </template>

      <VCardTitle>SMS Alerts Templates</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <div class="d-flex ga-2">
        <VBtn
          @click="sendSmsWithTemplate(template.id, leadStore.selectedLead.id)"
          color="primary"
          :disabled="
            !leadStore.selectedLead.phone_number_formatted || sendingSMS
          "
          :loading="sendingSMS"
          v-for="template in leadStore.sms_templates"
        >
          {{ template.name }}
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <VCard class="mt-6">
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
                This lead has invalid number, please fix it to allow sending
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
