<script lang="ts" setup>
import LeadsTable from "@/components/leads/table.vue";

const isAddLeadDialogVisible: any = ref(false)
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
                <VBtn @click="isAddLeadDialogVisible = true" color="primary">
                  Create Lead
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>
          <VCardText class="d-flex align-center flex-wrap gap-4 py-4 no-x-padding">
            <LeadsTable />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>

  <AddEditLeadDialog v-model:is-dialog-visible="isAddLeadDialogVisible" />
</template>
