<script setup lang="ts">
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { useUsersStore } from "@/stores/users/useUsersStore";

const usersStore = useUsersStore();
const leadsStore = useLeadsStore();
const permissionsStore: any = usePermissionsStore();

onMounted(async () => {
  // resetting on create
  usersStore.reset();

  await permissionsStore.getRoles();
  await leadsStore.getExtras();
});
</script>

<template>
  <VCard class="mb-4">
    <VCardItem>
      <template #prepend>
        <VBtn class="pa-1 mr-2" to="/users" size="x-small" rounded>
          <VIcon icon="mdi-arrow-left" />
        </VBtn>
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
