<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useLeadGeneratorAssignmentStore } from "@/stores/leads/useLeadGeneratorAssignmentStore";
import { EventBus } from "../../../utils/useEventBus";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
}

defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "Roles", key: "roles", sortable: false },
  {
    title: "Lead Generators",
    key: "lead_generator_assignments",
    sortable: false,
    width: "22%",
  },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  name: "",
});

// composables
const store: any = useLeadGeneratorAssignmentStore();
const emit = defineEmits<Emit>();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAllByUser({ include: store.userIncludes.join(",") })
);

const handleView = (item: any) => {
  store.selected = item;

  emit("update:isDialogVisible", true);
};

const handleApiCall = async () => {
  await store.fetchAllByUser({
    include: store.userIncludes.join(","),
    filters: store.userFilters,
  });
};

const onRowClick = ($event: PointerEvent, item: any) => {
  handleView(item.item.raw);
};

onMounted(async () => {
  await handleApiCall();

  EventBus.$on("refresh-table", async () => await handleApiCall());
});

onUnmounted(() => EventBus.$off("refresh-table"));
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="3">
      <VTextField
        v-model="filters.name"
        label="Name"
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
    @click:row="onRowClick"
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
  >
    <!-- Roles -->
    <!-- @vue-expect-error -->
    <template #item.roles="{ item }">
      <p
        v-if="item?.raw?.roles?.length < 1"
        class="font-italic text--lighten-4 mb-0"
      >
        No roles.
      </p>

      <VRow class="d-flex flex-wrap py-6">
        <VChip
          v-for="role in item.raw?.roles"
          label
          size="small"
          class="text-capitalize mb-1 mr-1"
          color="warning"
        >
          {{ role.name }}
        </VChip>
      </VRow>
    </template>

    <!-- Lead Generator Assignments -->
    <!-- @vue-expect-error -->
    <template #item.lead_generator_assignments="{ item }">
      <div class="d-flex align-center gap-4">
        <VAvatar
          v-if="item.raw.lead_generator_assignments.length > 1"
          :size="30"
          color="primary"
          variant="tonal"
        >
          <VIcon :size="20" icon="tabler-user" />
        </VAvatar>
        <span
          :class="
            item.raw.lead_generator_assignments.length > 1
              ? 'text-capitalize'
              : 'font-italic'
          "
        >
          {{
            item.raw.lead_generator_assignments.length > 1
              ? `${item.raw.lead_generator_assignments[0].name} ( +${
                  item.raw.lead_generator_assignments.length - 1
                } )`
              : "No assignments"
          }}
        </span>
      </div>
    </template>

    <!-- Actions -->
    <!-- @vue-expect-error-->
    <template #item.actions="{ item }">
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn @click="handleView(item.raw)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </template>
        <span>Assign or remove lead generators to a specific user.</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
