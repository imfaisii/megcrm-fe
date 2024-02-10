<script lang="ts" setup>
import { requiredValidator } from "@validators";
import { useCallCentersStore } from "@/stores/call-center/useCallCentersStore";
import { EventBus } from "../../utils/useEventBus";

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
  leadId: {
    required: true,
    type: Number,
  },
});

const route = useRoute();
const store = useCallCentersStore();
const formRef = ref();
const form = ref({
  call_center_status_id: null,
  called_at: null,
  comments: "",
});

const emit = defineEmits(["onDialogClose"]);

const closeDialog = () => {
  setTimeout(() => reset(), 1000);

  emit("onDialogClose");
};

const handleSubmit = async () => {
  const validation = await formRef.value.validate();

  if (validation?.valid) {
    await store.store({
      ...form.value,
      lead_id: route.params.id,
    });
  }
};

const reset = () => {
  form.value.call_center_status_id = null;
  form.value.called_at = null;
  form.value.comments = "";
};

onMounted(() => EventBus.$on("hide-dialog", () => closeDialog()));
onUnmounted(() => EventBus.$off("hide-dialog"));
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="isDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> Add a Call Record </VCardTitle>
      </VCardItem>

      <VForm ref="formRef" @submit.prevent="handleSubmit">
        <VCol cols="12">
          <AppDateTimePicker
            v-model="form.called_at"
            :rules="[requiredValidator]"
            :config="{
              wrap: true,
              altInput: true,
              altFormat: 'F j, Y H:i',
              dateFormat: 'Y-m-d H:i',
              enableTime: true,
            }"
            label="Call Time"
            placeholder="Select date and time"
            required
          />
        </VCol>

        <VCol cols="12">
          <VCombobox
            v-model="form.call_center_status_id"
            :items="store.callCenterStatuses"
            :rules="[requiredValidator]"
            label="Status"
            item-title="name"
            item-value="id"
            clearable
            required
            :return-object="false"
          />
        </VCol>

        <VCol cols="12">
          <VTextarea
            v-model="form.comments"
            :rules="[requiredValidator]"
            label="Comments"
            placeholder="Some comments..."
            auto-grow
            clearable
            counter
            required
          />
        </VCol>

        <VCol cols="12">
          <div class="d-flex align-center gap-3 mt-6">
            <VBtn
              type="submit"
              :disabled="store.isLoading"
              :loading="store.isLoading"
            >
              Save
            </VBtn>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VCol>
      </VForm>
    </VCard>
  </VDialog>
</template>
