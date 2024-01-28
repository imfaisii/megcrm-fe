<script setup lang="ts">
import LeadForm from "@/components/leads/create-form.vue";
import { usePermissionsStore } from '@/stores/permissions/usePermission';

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
}

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
})

const emit = defineEmits<Emit>()

const panel = ref(0)
const store = usePermissionsStore()
const form = reactive<any>({
  permissions: []
})

const handleSubmit = async () => {
  store.isRoleSelected
    ? await store.updateRole(form)
    : await store.storeRole(form)

  emit('update:isDialogVisible', false)
}

const closeDialog = () => emit('update:isDialogVisible', false)
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 1300" :model-value="isDialogVisible"
    @update:model-value="closeDialog">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> {{ store.isRoleSelected ? 'Edit' : 'Add New' }} Lead </VCardTitle>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- Form -->
        <LeadForm />
      </VCardText>
    </VCard>
  </VDialog>
</template>
