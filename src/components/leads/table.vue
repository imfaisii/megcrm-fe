<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { mergeProps } from "vue";

const store: any = useLeadsStore();

// Headers
const headers = [
  { title: "Name", key: "full_name", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Phone No.", key: "phone_no", sortable: true },
  { title: "Post Code", key: "post_code", sortable: true },
  { title: "Address", key: "address", sortable: true },
  { title: "Status" },
  { title: "Actions", key: "actions", sortable: false },
];

const onPaginationChange = async ($event: any) => {
  store.meta.per_page = $event.pagination.per_page;
  store.meta.current_page = $event.pagination.current_page;
  store.meta.sort = $event.sort;

  await store.fetchLeads();
};

const onSortChange = async ($event: any) => {
  store.meta.sort = $event.sort;

  await store.fetchLeads();
};

onMounted(async () => await store.fetchLeads());
</script>

<template>
  <DataTable
    :store="store"
    :items="store.leads"
    :headers="headers"
    class="text-no-wrap"
    show-select
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
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

    <!-- Status -->
    <template #item.status="{ item }">
      <VMenu>
        <template v-slot:activator="{ props: menu }">
          <VTooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn color="warning" v-bind="mergeProps(menu, tooltip)">
                Active
              </v-btn>
            </template>
            <span>Select the current status from the dropdown</span>
          </VTooltip>
        </template>
        <VList>
          <VListItem v-for="(item, index) in [{ title: 'Test' }]" :key="index">
            <VListItemTitle>{{ item.title }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
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
  </DataTable>
</template>
