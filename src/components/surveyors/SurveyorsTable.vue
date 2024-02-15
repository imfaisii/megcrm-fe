<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { useSurveyorsStore } from "@/stores/surveyors/useSurveyorsStore";
import { removeEmptyAndNull } from "../../utils/useHelper";

const store: any = useSurveyorsStore();
const rolesStore: any = usePermissionsStore();

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email", searchable: true },
  { title: "Status", key: "status", sortable: false, searchable: true },
  { title: "Role", key: "role", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref<any>({
  name: "",
  email: "",
  roles: [],
});

const includes = ["createdBy"];

const resolveUserRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase();

  if (roleLowerCase === "super admin")
    return { color: "warning", icon: "tabler-device-laptop" };

  return { color: "primary", icon: "tabler-user" };
};

const resolveUserStatusVariant = (stat: string) => {
  if (stat) {
    return "success";
  }

  return "error";
};

// composables
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAll({ include: includes.join(",") })
);

const handleDestroy = async (id: any) => {
  await store.destroy(id);
  await store.fetchAll({
    include: includes.join(","),
    filters: removeEmptyAndNull(filters.value),
  });
};

onMounted(async () => {
  await rolesStore.getRoles();

  const surveyorRecord: any = rolesStore.roles.find(
    (i: any) => i.name === "surveyor"
  );

  if (surveyorRecord) {
    filters.value.roles.push(surveyorRecord.id);
  }
});
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="6">
      <VTextField v-model="filters.name" label="Name" clearable />
    </VCol>

    <VCol cols="12" lg="6">
      <VTextField v-model="filters.email" label="Email" clearable />
    </VCol>
  </VRow>

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
    <template #item.name="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <h6 class="text-base">
            {{ item.raw.name }}
          </h6>
        </div>
      </div>
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
      <VChip
        label
        size="small"
        class="text-capitalize"
        :color="resolveUserStatusVariant(item.raw.is_active)"
      >
        {{ item.raw.is_active ? "Active" : "Inactive" }}
      </VChip>
    </template>

    <!-- Role -->
    <template #item.role="{ item }">
      <div class="d-flex align-center gap-4">
        <VAvatar
          :size="30"
          :color="resolveUserRoleVariant(item.raw.top_role).color"
          variant="tonal"
        >
          <VIcon
            :size="20"
            :icon="resolveUserRoleVariant(item.raw.top_role).icon"
          />
        </VAvatar>
        <span class="text-capitalize">
          {{ item.raw.top_role == "" ? "No role" : item.raw.top_role }}
          {{
            item.raw.roles.length > 1 ? `( +${item.raw.roles.length - 1} )` : ""
          }}
        </span>
      </div>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <IconBtn @click="store.fetch(item.raw.id)">
        <VProgressCircular
          v-if="store.isLoading && store.selectedId === item.raw.id"
          size="24"
          color="info"
          indeterminate
        />
        <VIcon v-else icon="tabler-edit" />
      </IconBtn>
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn
            v-if="item.raw.id !== 1"
            @click="handleDestroy(item.raw.id)"
            v-bind="props"
          >
            <VProgressCircular
              v-if="store.isLoading && store.selectedId === item.raw.id"
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span>Are you sure you want to delete this user?</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
