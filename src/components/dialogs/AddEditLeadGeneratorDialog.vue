<script setup lang="ts">
import { useLeadGeneratorsStore } from "@/stores/lead-generators/useLeadGeneratorsStore";
import { requiredValidator } from "@validators";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
}

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

const store = useLeadGeneratorsStore();
const emit = defineEmits<Emit>();

const closeDialog = () => {
  store.resetState();

  emit("update:isDialogVisible", false);
};

const handleSubmit = async () => {
  try {
    if (store?.selected?.id) {
      await store.update(store.selected.id, store.selected);
    } else {
      await store.store(store.selected);
    }

    store.fetchAll({ include: store.include.join(",") });

    closeDialog();
  } catch (e) {
    //
  }
};
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="isDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> Lead Generator </VCardTitle>
      </VCardItem>

      <VCardText class="mt-6">
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="store.selected.name"
                :rules="[requiredValidator]"
                :error-messages="store.errors?.name"
                label="Name"
                placeholder="Raw Lead"
                clearable
                required
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="store.selected.sender_id"
                :rules="[requiredValidator]"
                :error-messages="store.errors?.sender_id"
                label="SMS Sender Name"
                placeholder="MEG"
                clearable
                required
              />
            </VCol>
          </VRow>

          <!-- Actions button -->
          <div class="d-flex align-center gap-3 mt-6">
            <VBtn
              type="submit"
              :disabled="store.isLoading"
              :loading="store.isLoading"
            >
              {{ store.isSelected ? "Update" : "Create" }} {{ title }}
            </VBtn>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
