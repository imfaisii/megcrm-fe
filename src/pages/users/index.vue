<script lang="ts" setup>
import UsersTable from "@/components/users/UsersTable.vue";
import { roles } from "@/constants/rolesAndPermissions";

const isAddUserDialogVisible: any = ref(false);
</script>
<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard class="users-card">
          <VCardTitle class="pl-4 pr-4 mt-3 mb-2">
            <VRow class="text-layout">
              <VCol cols="6" class="text-left">
                <h6 class="text-h5">Users Table</h6>
              </VCol>
              <VCol cols="6" class="text-right">
                <VBtn
                  v-if="is(roles.SUPER_ADMIN) || can('users.store')"
                  @click="isAddUserDialogVisible = true"
                  color="primary"
                >
                  Create User
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>

          <UsersTable v-if="is(roles.SUPER_ADMIN) || can('users.index')" />
        </VCard>
      </VCol>
    </VRow>
    <AddEditUserDialog v-model:is-dialog-visible="isAddUserDialogVisible" />
  </section>
</template>
