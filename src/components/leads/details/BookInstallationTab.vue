<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { requiredValidator } from "@validators";

const store = useLeadsStore();

onMounted(async () => {
  await store.getExtras();
});
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-tools" class="text-disabled" />
      </template>

      <VCardTitle>Installation Details</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12" lg="6">
          <VAutocomplete
            v-model="store.selectedLead.installation_booking.installer_id"
            :items="store.installers"
            :rules="[requiredValidator]"
            label="Installer"
            item-title="name"
            item-value="id"
            clearable
            required
            :return-object="false"
          />
        </VCol>

        <VCol cols="12" lg="6">
          <AppDateTimePicker
            v-model="store.selectedLead.installation_booking.installation_at"
            :rules="[requiredValidator]"
            :config="{
              minDate: 'today',
              altInput: true,
              altFormat: 'F j, Y H:i',
              dateFormat: 'Y-m-d H:i',
              enableTime: true,
            }"
            label="Installation Time"
            placeholder="Select date and time"
            required
          />
        </VCol>

        <VCol cols="12">
          <VTextarea
            v-model="store.selectedLead.installation_booking.comments"
            label="Comments"
            placeholder="Some comments..."
            auto-grow
            clearable
            counter
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
