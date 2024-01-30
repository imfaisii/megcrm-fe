<script lang="ts" setup>
import LeadForm from "@/components/leads/CreateForm.vue";
</script>

<template>
  <VCard class="pa-sm-8 pa-5">
    <!-- Title -->
    <VCardItem>
      <VCardTitle class="text-h4 mb-3"> Create Lead </VCardTitle>
      <p class="text-muted">You can leads in the system here.</p>
    </VCardItem>

    <VCardText>
      <LeadForm :is-full-page="true" />
    </VCardText>
  </VCard>
</template>
