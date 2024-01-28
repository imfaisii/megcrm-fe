<script setup lang="ts">
import LeadForm from "@/components/leads/create-form.vue";
import { usePermissionsStore } from "@/stores/permissions/usePermission";

interface Emit {
  (e: "update:isLeadDialogVisible", value: boolean): void;
}

defineProps({
  isLeadDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits<Emit>();

const store = usePermissionsStore();
const form = reactive<any>({
  permissions: [],
});

const handleSubmit = async () => {
  store.isRoleSelected
    ? await store.updateRole(form)
    : await store.storeRole(form);

  emit("update:isLeadDialogVisible", false);
};

const closeDialog = () => emit("update:isLeadDialogVisible", false);
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 1300"
    :model-value="isLeadDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3">
          {{ store.isRoleSelected ? "Edit" : "Add New" }} Lead
        </VCardTitle>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- Form -->
        <LeadForm>
          <template #dialogCloseButton>
            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </template>
        </LeadForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
