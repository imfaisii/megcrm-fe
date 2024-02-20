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
        <VIcon icon="mdi-home-plus" class="text-disabled" />
      </template>

      <VCardTitle>Survey Booking Details</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12" lg="4">
          <VCombobox
            v-model="store.selectedLead.survey_booking.surveyor_id"
            :items="store.surveyors"
            :rules="[requiredValidator]"
            label="Surveyor"
            item-title="user.name"
            item-value="id"
            clearable
            required
            :return-object="false"
          />
        </VCol>

        <VCol cols="12" lg="4">
          <AppDateTimePicker
            v-model="store.selectedLead.survey_booking.survey_at"
            :rules="[requiredValidator]"
            :config="{
              minDate: 'today',
              altInput: true,
              altFormat: 'F j, Y H:i',
              dateFormat: 'Y-m-d H:i',
              enableTime: true,
            }"
            label="Survey Time"
            placeholder="Select date and time"
            required
          />
        </VCol>

        <VCol cols="12" lg="4">
          <VSelect
            v-model="store.selectedLead.survey_booking.preffered_time"
            :rules="[requiredValidator]"
            :items="['Morning', 'Afternoon', 'Evening']"
            label="Preffered Time"
            clearable
            required
          />
        </VCol>

        <VCol cols="12">
          <VTextarea
            v-model="store.selectedLead.survey_booking.comments"
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
