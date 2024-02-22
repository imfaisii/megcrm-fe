<script lang="ts" setup>
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { useDropzone } from "vue3-dropzone";

import Skeleton from "primevue/skeleton";

const store = useLeadsStore();
const dbStore = useDropboxStore();

const visible = ref(false);
const imgs = ref();
const indexRef = ref(0);
const folder = `${store.selectedLead.post_code
  .toUpperCase()
  .replace(/ /g, "")} - ${store.selectedLead.address}`;

const show = (url: string) => {
  imgs.value = url;
  visible.value = true;
};

const saveFiles = async (files: any) => {
  for await (const file of files) {
    await dbStore.store(folder, file);
  }

  await dbStore.index(folder);
};

const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

onMounted(async () => {
  await dbStore.create(folder);
  await dbStore.index(folder);
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="py-2 px-4">
        <template #prepend>
          <VIcon icon="mdi-image-marker" class="text-disabled" />
        </template>

        <VCardTitle
          >Survey Pictures ( {{ dbStore.folderImages.length }} )</VCardTitle
        >

        <template #append>
          <div class="me-n3 mt-n2">
            <VCol cols="12">
              <div v-bind="getRootProps()">
                <input v-bind="getInputProps()" />
                <VTooltip>
                  <template #activator="{ props }">
                    <VBtn
                      :loading="dbStore.loading"
                      :disabled="dbStore.loading"
                      v-bind="props"
                      color="primary"
                      icon="mdi-upload-outline"
                    />
                  </template>

                  <span>Upload files</span>
                </VTooltip>
              </div>
            </VCol>
          </div>
        </template>
      </VCardItem>
    </VCard>

    <VRow class="pa-2 mt-4">
      <VCol
        v-for="image in (dbStore.folderImages as any)"
        :key="image.id"
        class="image-card"
        cols="12"
        sm="6"
        md="3"
      >
        <div v-if="image.link === undefined">
          <Skeleton height="2rem" class="mb-2" borderRadius="16px" />

          <VCardText class="position-relative">
            <VCardTitle>
              <Skeleton width="5rem" borderRadius="16px" class="mb-2" />
            </VCardTitle>
          </VCardText>
        </div>
        <VCard @click="show(image.link)" v-else>
          <VTooltip>
            <template #activator="{ props }">
              <div v-bind="props">
                <VImg :src="image.link" height="170" loading="lazy" cover />

                <VCardSubtitle class="pa-3">{{ image.name }}</VCardSubtitle>
              </div>
            </template>
            <span>Click to preview</span>
          </VTooltip>
        </VCard>
      </VCol>

      <VCol v-if="dbStore.loading" cols="12" sm="6" md="3">
        <Skeleton height="2rem" class="mb-2" borderRadius="16px" />

        <VCardText class="position-relative">
          <VCardTitle>
            <Skeleton width="5rem" borderRadius="16px" class="mb-2" />
          </VCardTitle>
        </VCardText>
      </VCol>
    </VRow>

    <VueEasyLightbox
      :visible="visible"
      :imgs="imgs"
      :index="indexRef"
      @hide="visible = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.image-card {
  padding-inline: 4px 4px;

  :hover {
    cursor: pointer;
  }
}
</style>
