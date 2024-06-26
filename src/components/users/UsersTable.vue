<script lang="ts" setup>
import { useUsersStore } from "@/stores/users/useUsersStore";

const usersStore: any = useUsersStore();

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email", searchable: true },
  { title: "Status", key: "status", sortable: false, searchable: true },
  { title: "Role", key: "role", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

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

const onPaginationChange = async ($event: any) => {
  usersStore.meta.per_page = $event.pagination.per_page;
  usersStore.meta.current_page = $event.pagination.current_page;
  usersStore.meta.sort = $event.sort;

  await usersStore.fetchUsers();
};

const onSortChange = async ($event: any) => {
  usersStore.meta.sort = $event.sort;

  await usersStore.fetchUsers();
};

onMounted(async () => await usersStore.fetchUsers());
</script>

<template>
  <DataTable
    :store="usersStore"
    :items="usersStore.users"
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
      <IconBtn @click="usersStore.fetchUser(item.raw.id)">
        <VProgressCircular
          v-if="usersStore.isLoading && usersStore.selectedId === item.raw.id"
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
            @click="usersStore.deleteUser(item.raw.id)"
            v-bind="props"
          >
            <VProgressCircular
              v-if="
                usersStore.isLoading && usersStore.selectedId === item.raw.id
              "
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
