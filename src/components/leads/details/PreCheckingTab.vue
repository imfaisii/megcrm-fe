<script setup lang="ts">
// import CardStatisticsWeeklySales from "@/components/leads/details/PreCheckingTab.vue";
import personWithCup from "@images/cards/illustration-1.png";
import { VIcon } from "vuetify/components";

const item = {
  slideImg: personWithCup,
  data: [
    {
      number: "24",
      text: "Boilers",
    },
    {
      number: "50",
      text: "Accessories",
    },
    {
      number: "12",
      text: "Tables",
    },
    {
      number: "38",
      text: "Home",
    },
    {
      number: "38",
      text: "Roof",
    },
    {
      number: "38",
      text: "Insulation",
    },
    {
      number: "38",
      text: "Top",
    },
    {
      number: "38",
      text: "Floor",
    },
  ],
};
</script>

<template>
  <VCard class="mb-2">
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-image-check" class="text-disabled" />
      </template>

      <VCardTitle>Pre Checking Details Details</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12">
          <h6 class="text-h6 mb-1">Pictures Report</h6>
          <p class="d-flex align-center gap-2 text-xs mb-0">
            <span>Total 103 Pictures</span>
          </p>
        </VCol>

        <VCol cols="12" class="d-flex align-center gap-4">
          <img width="84" :src="item.slideImg" class="rounded" />

          <VRow no-gutters>
            <VCol
              v-for="d in item.data"
              :key="d.number"
              cols="3"
              class="text-no-wrap text-truncate text-xs pt-2"
            >
              <VChip label size="small" class="me-2">
                {{ d.number }}
              </VChip>
              <span class="me-2">{{ d.text }}</span>
            </VCol>
          </VRow>
        </VCol>

        <VCol cols="12">
          <VBtn size="small"> Add Notes </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
