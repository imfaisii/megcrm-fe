<script lang="ts" setup>
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { useDropzone } from "vue3-dropzone";

import Skeleton from "primevue/skeleton";

const store = useLeadsStore();
const dbStore = useDropboxStore();

const saveFiles = async (files: any) => {
  await dbStore.store(store.selectedLead.address, files[0]);

  await dbStore.index(store.selectedLead.address);
};

const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

onMounted(async () => {
  await dbStore.create(store.selectedLead.address);
  await dbStore.index(store.selectedLead.address);
});
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-image-marker" class="text-disabled" />
      </template>

      <VCardTitle>Survey Pictures</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12" class="mb-3">
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps()" />
            <VBtn color="primary"> Upload files </VBtn>
          </div>
        </VCol>
        <VCol
          v-for="image in (dbStore.folderImages as any)"
          :key="image.id"
          cols="12"
          sm="6"
          md="4"
        >
          <div v-if="image.link === undefined">
            <Skeleton height="2rem" class="mb-2" borderRadius="16px" />

            <VCardText class="position-relative">
              <VCardTitle>
                <Skeleton width="5rem" borderRadius="16px" class="mb-2" />
              </VCardTitle>
            </VCardText>
          </div>
          <VCard v-else>
            <VImg :src="image.link" height="201" cover />

            <VCardText class="position-relative">
              <VCardTitle>{{ image.name }}</VCardTitle>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
