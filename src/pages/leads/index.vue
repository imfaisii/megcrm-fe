<script lang="ts" setup>
import LeadsTable from "@/components/leads/table.vue";
import { roles } from "@/constants/rolesAndPermissions";

const isAddLeadDialogVisible: any = ref(false);
</script>
<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard class="leads-card">
          <VCardTitle class="pl-4 pr-4 mt-3 mb-2">
            <VRow class="text-layout">
              <VCol cols="6" class="text-left">
                <h6 class="text-h5">Leads Table</h6>
              </VCol>
              <VCol cols="6" class="text-right">
                <VBtn
                  v-if="is(roles.SUPER_ADMIN) || can('leads.index')"
                  @click="isAddLeadDialogVisible = true"
                  color="primary"
                >
                  Create Lead
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>

          <LeadsTable v-if="is(roles.SUPER_ADMIN) || can('leads.store')" />
        </VCard>
      </VCol>
    </VRow>
  </section>

  <AddEditLeadDialog v-model:is-lead-dialog-visible="isAddLeadDialogVisible" />
</template>
