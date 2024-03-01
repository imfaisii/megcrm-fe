<script setup lang="ts">
import { useToast } from "@/plugins/toastr";
import { useUsersStore } from "@/stores/users/useUsersStore";
import { useDropzone } from "vue3-dropzone";

interface Props {
  title: string;
  color?: string;
  icon: string;
  hasExpiry: boolean;
  link?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
});

const usersStore = useUsersStore();
const expiry = ref(null);
const loading = ref(false);
const $toast = useToast();
const isPdf = ref(false);
const isImage = ref(false);
const selectedFile = ref("");
const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);
const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: ["image/*", ".pdf"],
  multiple: false,
});

const onButtonClick = (type: string) => (selectedFile.value = type);

const saveFiles = async (files: any) => {
  if (Array.isArray(files) && files.length > 0) {
    await usersStore.saveDocumentToCollection(
      "installer-documents",
      files[0],
      props.title,
      expiry.value
    );
  }
};

const handleView = () => {
  if (isPdf.value) {
    alert("pdf");
  } else if (isImage.value) {
    alert("image");
  } else {
    $toast.error("View not supported for this file.");
  }
};
</script>

<template>
  <div class="rounded-lg mt-2" :style="{ background: 'floralwhite' }">
    <VForm>
      <VRow class="mb-0">
        <VCol cols="12">
          <VCardText class="d-flex align-center justify-space-between">
            <div class="d-flex align-center" :style="{ gap: 0 }">
              <VAvatar
                size="40"
                rounded
                :color="props.color"
                variant="tonal"
                class="me-4"
              >
                <VIcon :icon="props.icon" size="24" />
              </VAvatar>

              <span class="font-italic mt-2">{{ props.title }}</span>
            </div>

            <!-- View or Download Button -->
            <div v-if="link">
              <VTooltip v-if="isImage || isPdf">
                <template #activator="{ props }">
                  <VBtn
                    @click="handleView"
                    v-bind="props"
                    class="mr-2"
                    size="small"
                    color="secondary"
                    icon="mdi-eye-outline"
                  />
                </template>
                <span> Click to view file ( Only PDF are viewable ) </span>
              </VTooltip>
              <VTooltip>
                <template #activator="{ props }">
                  <VBtn
                    :href="fileObject.link"
                    v-bind="props"
                    size="small"
                    color="info"
                    icon="mdi-download-outline"
                  />
                </template>
                <span> Click to download file </span>
              </VTooltip>
            </div>

            <!-- Upload Button -->
            <div v-else>
              <div v-bind="getRootProps()">
                <input v-bind="getInputProps()" />
                <VTooltip>
                  <template #activator="{ props }">
                    <VBtn
                      @click="onButtonClick(title)"
                      v-bind="props"
                      size="small"
                      color="primary"
                      :disabled="loading || (hasExpiry && !expiry)"
                      icon="mdi-upload-outline"
                    />
                  </template>
                  <span>
                    This file will be automatically named as {{ props.title }}
                  </span>
                </VTooltip>
              </div>
            </div>
          </VCardText>
        </VCol>
      </VRow>

      <VRow class="pa-4 mt-0" v-if="hasExpiry">
        <VCol cols="12">
          <VTextField
            label="Expiry"
            placeholder="Select document expiry"
            v-model="expiry"
            type="date"
          />
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>
