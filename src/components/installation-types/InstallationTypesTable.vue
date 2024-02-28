<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useInstallationTypeStore } from "@/stores/installation-types/useInstallationTypeStore";
import { EventBus } from "@/utils/useEventBus";

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "Measures", key: "installation_type_has_measures", sortable: false },
  { title: "Added by", key: "created_by.name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  name: "",
});

// composables
const store: any = useInstallationTypeStore();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAll({ include: store.includes.join(",") })
);

const handleView = (item: any) => {
  store.selected = item;
  store.selected.measures = item.installation_type_has_measures.map(
    (e: any) => e.pivot.measure_id
  );

  EventBus.$emit("show-installation-dialog");
};
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="3">
      <VTextField v-model="filters.name" label="Name" clearable />
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
    <!-- Measures -->
    <template #item.installation_type_has_measures="{ item }">
      <p
        v-if="item?.raw?.installation_type_has_measures?.length < 1"
        class="font-italic text--lighten-4 mb-0"
      >
        No measures.
      </p>

      <VRow v-else class="mt-2" no-gutters>
        <VCol
          v-for="measure in item.raw?.installation_type_has_measures"
          cols="12"
          lg="4"
        >
          <VChip
            label
            size="small"
            class="text-capitalize mb-1"
            color="warning"
          >
            {{ measure.name }}
          </VChip>
        </VCol>
      </VRow>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <IconBtn @click="handleView(item.raw)">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <!-- <VTooltip location="bottom">
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
        <span>
          Are you sure you want to delete this installation engineer type?
        </span>
      </VTooltip> -->
    </template>
  </DataTable>
</template>
