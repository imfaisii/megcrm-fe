<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useSurveyorsStore } from "@/stores/surveyors/useSurveyorsStore";

// Headers
const headers = [
  { title: "Name", key: "user.name" },
  { title: "Email", key: "user.email" },
  { title: "Status", key: "user.status", sortable: false },
  { title: "Role", key: "user.role", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  user: {
    name: "",
    email: "",
    roles: [],
  },
});

// composables
const store: any = useSurveyorsStore();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.index({ include: store.includes.join(",") })
);

onMounted(async () => await store.index({ include: store.includes.join(",") }));
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="6">
      <VTextField v-model="filters.user.name" label="Name" clearable />
    </VCol>

    <VCol cols="12" lg="6">
      <VTextField v-model="filters.user.email" label="Email" clearable />
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
    <!-- Name -->
    <template #item.user.name="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <h6 class="text-base">
            {{ item.raw.user.name }}
          </h6>
        </div>
      </div>
    </template>

    <!-- Email -->
    <template #item.user.email="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <span class="text-sm text-medium-emphasis">{{
            item.raw.user.email
          }}</span>
        </div>
      </div>
    </template>

    <!-- Status -->
    <template #item.user.status="{ item }">
      <VChip
        label
        size="small"
        class="text-capitalize"
        :color="store.resolveUserStatusVariant(item.raw.user.is_active)"
      >
        {{ item.raw.user.is_active ? "Active" : "Inactive" }}
      </VChip>
    </template>

    <!-- Role -->
    <template #item.user.role="{ item }">
      <div class="d-flex align-center gap-4">
        <VAvatar
          :size="30"
          :color="store.resolveUserRoleVariant(item.raw.user.top_role).color"
          variant="tonal"
        >
          <VIcon
            :size="20"
            :icon="store.resolveUserRoleVariant(item.raw.user.top_role).icon"
          />
        </VAvatar>
        <span class="text-capitalize">
          {{
            item.raw.user.top_role == "" ? "No role" : item.raw.user.top_role
          }}
          {{
            item.raw.user.roles.length > 1
              ? `( +${item.raw.user.roles.length - 1} )`
              : ""
          }}
        </span>
      </div>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <IconBtn @click="store.get(item.raw.user.id)">
        <VProgressCircular
          v-if="store.isLoading && store.selectedId === item.raw.user.id"
          size="24"
          color="info"
          indeterminate
        />
        <VIcon v-else icon="tabler-edit" />
      </IconBtn>
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="store.destroy(item.raw.user.id)">
            <VProgressCircular
              v-if="
                store.isLoading &&
                store.selected?.id &&
                store.selected.id === item.raw.user.id
              "
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span>Are you sure you want to delete this surveyor?</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
