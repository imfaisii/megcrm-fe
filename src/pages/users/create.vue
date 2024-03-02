<script setup lang="ts">
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";

const leadsStore = useLeadsStore();
const permissionsStore: any = usePermissionsStore();

onMounted(async () => {
  await permissionsStore.getRoles();
  await leadsStore.getExtras();
});
</script>

<template>
  <VCard class="mb-4">
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-account-outline" class="text-disabled" />
      </template>

      <VCardTitle>New User Details</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <UserComponent />
    </VCardText>
  </VCard>
</template>
