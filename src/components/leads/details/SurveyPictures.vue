<script lang="ts" setup>
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { isImageFileName } from "@/utils/useHelper";
import errorimage from "@images/custom/404.jpg";
import Compressor from "compressorjs";
import { useDropzone } from "vue3-dropzone";

const dbStore = useDropboxStore();
const leadsStore = useLeadsStore();

const show = (image: any) => {
  if (isImageFileName(image.name)) {
    const toShow = dbStore.folderImages.map((i: any) => i.link);
    const index = toShow.indexOf(image.link);

    EventBus.$emit("view-lightbox", {
      imgs: toShow,
      index: index !== -1 ? index : 0,
    });
  } else {
    window.open(image.link, "_blank");
  }
};

const saveFiles = async (files: any) => {
  for await (const file of files) {
    if (!file) {
      return;
    }

    new Compressor(file, {
      quality: 0.5,
      async success(result: any) {
        await dbStore.store(dbStore.folder, "Survey", result);
      },
      error(err: any) {
        console.log(err.message);
      },
    });
  }

  await leadsStore.updateStatus({
    leadId: leadsStore.selectedLead.id,
    status: "Survey Done",
    comments: "All files were uploaded to dropbox.",
  });

  dbStore.index(dbStore.folder);
  EventBus.$emit("refresh-lead-data");
};

const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);

const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: ["image/*", "video/*", "application/pdf"],
});

const showRenameDialog = (fileName: string, filePath: string) => {
  EventBus.$emit("show-dropbox-rename-dialog", {
    fileName,
    filePath,
  });
};

onMounted(async () => {
  await dbStore.create(`${dbStore.folder}/Survey`);
  dbStore.index(dbStore.folder);
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="py-2 px-4">
        <template #prepend>
          <VIcon icon="mdi-image-marker" class="text-disabled" />
        </template>

        <VCardTitle>
          Survey Pictures ( {{ dbStore.folderImages.length }} )
        </VCardTitle>

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
        <VCard @click="show(image)" v-else>
          <VTooltip>
            <template #activator="{ props }">
              <div v-bind="props">
                <VRow>
                  <VCol cols="12">
                    <!-- Image -->
                    <VImg
                      :src="`${
                        isImageFileName(image.name) ? image.link : errorimage
                      }`"
                      height="450"
                      loading="lazy"
                    />
                  </VCol>

                  <VCol
                    class="d-flex justify-space-between align-center pa-3 mb-2"
                    cols="12"
                  >
                    <!-- Name -->
                    <VCardSubtitle>{{ image.name }}</VCardSubtitle>

                    <!-- Edit Button -->

                    <IconBtn
                      size="x-small"
                      class="mr-2"
                      @click.stop="
                        showRenameDialog(image.name, image.path_display)
                      "
                    >
                      <VTooltip>
                        <template #activator="{ props }">
                          <VIcon
                            v-bind:="props"
                            size="large"
                            color="secondary"
                            icon="mdi-pencil-outline"
                          />
                        </template>
                        <span>Rename file</span>
                      </VTooltip>
                    </IconBtn>
                  </VCol>
                </VRow>
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
  </div>

  <!-- Dialogs-->
  <RenameFileDialog />
</template>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
:deep(.image-card img) {
  object-fit: fill !important;
}

.image-card {
  padding-inline: 4px 4px;

  :hover {
    cursor: pointer;
  }
}
</style>
