<script lang="ts" setup>
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { renameFile } from "@/utils/useHelper";
import { requiredValidator } from "@validators";
import { useDropzone } from "vue3-dropzone";

const props = defineProps({
  isOtherDocumentDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

const store = useLeadsStore();
const dbStore = useDropboxStore();
const formRef = ref();
const name: any = ref(null);

const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);
const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: ["image/*", ".pdf"],
  multiple: false,
});

const emit = defineEmits(["onDialogClose"]);
const closeDialog = () => emit("onDialogClose");

const saveFiles = async (files: any) => {
  if (Array.isArray(files) && files.length > 0) {
    await dbStore.store(
      dbStore.folder,
      "Pre Checking",
      renameFile(files[0], name.value)
    );

    await dbStore.getPreCheckingFiles(dbStore.folder, true);

    name.value = null;
    emit("onDialogClose");
  }
};

watch(
  () => props.isOtherDocumentDialogVisible,
  (n) => {
    if (n) {
      setTimeout(() => formRef?.value?.validate((v: any) => {}), 500);
    }
  }
);
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="isOtherDocumentDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> Add New Attachment </VCardTitle>
      </VCardItem>

      <VForm ref="formRef">
        <VCol cols="12">
          <VSelect
            v-model="name"
            :rules="[requiredValidator]"
            :items="store.benefitTypes"
            label="Benefit Types"
            placeholder="Select Benefit"
            item-title="name"
            item-value="name"
            clearable
            required
            :return-object="false"
          />
        </VCol>

        <VCol cols="12">
          <div class="d-flex align-center gap-3 mt-6">
            <div v-if="name" v-bind="getRootProps()">
              <input v-bind="getInputProps()" />
              <VBtn :disabled="dbStore.loading" :loading="dbStore.loading">
                Upload File
              </VBtn>
            </div>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VCol>
      </VForm>
    </VCard>
  </VDialog>
</template>
