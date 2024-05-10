<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useLeadGeneratorsStore } from "@/stores/lead-generators/useLeadGeneratorsStore";
import { EventBus } from "@/utils/useEventBus";

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "SMS Sender Title", key: "sender_id" },
  { title: "Email Ref. SMS", key: "email" },
  { title: "Phone Ref. SMS", key: "phone_no" },
  { title: "Aircall Number", key: "aircall_number" },
  {
    title: "Managers",
    key: "lead_generator_managers",
    sortable: false,
  },
  { title: "Added by", key: "created_by.name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  name: "",
  sender_id: "",
  email: "",
  phone_no: "",
});

// composables
const store: any = useLeadGeneratorsStore();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAll({ include: store.include.join(",") })
);

const handleView = (item: any) => {
  store.selected = item;

  EventBus.$emit("item-selected");
};
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.name"
        label="Name"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.sender_id"
        label="Sender Name"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.email"
        label="Email"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.phone_no"
        label="Phone No"
        clearable
        density="compact"
      />
    </VCol>
  </VRow>

  <!-- Table-->
  <DataTable
    :store="store"
    :items="store.entries"
    :headers="headers"
    class="text-no-wrap"
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
  >
    <!-- @vue-expect-error -->
    <template #item.email="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.email ?? "NULL" }}</p>
    </template>

    <!-- @vue-expect-error -->
    <template #item.phone_no="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.phone_no ?? "NULL" }}</p>
    </template>

    <!-- @vue-expect-error -->
    <template #item.aircall_number="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.aircall_number ?? "NULL" }}</p>
    </template>

    <!-- @vue-expect-error -->
    <template #item.lead_generator_managers="{ item }">
      <p
        v-if="item?.raw?.lead_generator_managers?.length < 1"
        class="font-italic text--lighten-4 mb-0"
      >
        No assignments.
      </p>

      <VRow v-else class="mt-2" no-gutters>
        <VCol
          v-for="user in item.raw?.lead_generator_managers"
          cols="12"
          lg="6"
        >
          <VChip
            label
            size="small"
            class="text-capitalize mb-1"
            color="success"
          >
            {{ user.name }}
          </VChip>
        </VCol>
      </VRow>
    </template>

    <!-- Actions -->
    <!-- @vue-expect-error -->
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
        <span>Are you sure you want to delete this lead generator?</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
