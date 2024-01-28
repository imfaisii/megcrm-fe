<script lang="ts" setup>
import { setStoreMeta } from "@/constants/pagination";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { VDataTableServer } from "vuetify/labs/VDataTable";

const store: any = useLeadsStore();

// Headers
const headers = [
  { title: "Email", key: "email", searchable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const resolveLeadRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase();

  if (roleLowerCase === "super admin")
    return { color: "warning", icon: "tabler-device-laptop" };

  return { color: "primary", icon: "tabler-user" };
};

const resolveLeadStatusVariant = (stat: string) => {
  if (stat) {
    return "success";
  }

  return "error";
};
</script>

<template>
  <VDataTableServer
    v-model:items-per-page="store.meta.per_page"
    v-model:page="store.meta.current_page"
    :items="store.leads"
    :items-length="10"
    :headers="headers"
    @update:options="setStoreMeta($event, store.meta) && store.fetchLeads()"
    class="text-no-wrap"
    show-select
  >
    <template #top>
      <VProgressLinear
        v-if="store.isLoading"
        indeterminate
        color="primary"
        :height="2"
      >
      </VProgressLinear>
    </template>

    <!-- Email -->
    <template #item.email="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <span class="text-sm text-medium-emphasis">{{ item.raw.email }}</span>
        </div>
      </div>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <!-- <IconBtn>
        <VIcon icon="tabler-edit" />
      </IconBtn> -->
      <IconBtn @click="store.deleteLead(item.raw.id)">
        <VIcon color="error" icon="tabler-trash" />
      </IconBtn>
    </template>

    <!-- pagination -->
    <template #bottom>
      <VDivider />

      <Pagination :store="store" />
    </template>
  </VDataTableServer>
</template>
