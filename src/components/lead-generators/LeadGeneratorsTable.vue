<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useLeadGeneratorsStore } from "@/stores/lead-generators/useLeadGeneratorsStore";
import { EventBus } from "@/utils/useEventBus";

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "SMS Sender Title", key: "sender_id" },
  { title: "Email Reference in SMS", key: "email" },
  { title: "Added by", key: "created_by.name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  name: "",
  sender_id: "",
  email: "",
});

const includes = ["createdBy"];

// composables
const store: any = useLeadGeneratorsStore();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAll({ include: includes.join(",") })
);

const handleView = (item: any) => {
  store.selected = item;

  EventBus.$emit("item-selected");
};
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" md="4">
      <VTextField v-model="filters.name" label="Name" clearable />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField v-model="filters.sender_id" label="Sender Name" clearable />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField v-model="filters.email" label="Email" clearable />
    </VCol>
  </VRow>

  <!-- Table-->
  <DataTable
    :store="store"
    :items="store.entries"
    :headers="headers"
    class="text-no-wrap"
    show-select
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
  >
    <template #item.email="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.email ?? "NULL" }}</p>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <IconBtn @click="handleView(item.raw)">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="store.destroy(item.raw.id)">
            <VProgressCircular
              v-if="
                store.isLoading &&
                store.selected?.id &&
                store.selected.id === item.raw.id
              "
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span>Are you sure you want to delete this leaad generator?</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
