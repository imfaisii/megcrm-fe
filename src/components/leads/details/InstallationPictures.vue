<script lang="ts" setup>
import { ADDITIONAL } from "@/constants/general";
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { isImageFileName, sleep } from "@/utils/useHelper";
import errorimage from "@images/custom/404.jpg";
import { useDropzone } from "vue3-dropzone";

const dbStore = useDropboxStore();
const filesUploaded = ref(0);
const selectedFilesLength = ref(0);
const isUploading = ref(false);
const leadsStore = useLeadsStore();

const selectedTags = ref<string[]>([]);

const selectTag = (v: string) => {
  const index = selectedTags.value.indexOf(v);

  if (index !== -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(v);
  }
};

const show = (image: any) => {
  if (isImageFileName(image.name)) {
    const toShow = dbStore.installationImages.map((i: any) => i.link);
    const index = toShow.indexOf(image.link);

    EventBus.$emit("view-lightbox", {
      imgs: toShow,
      index: index !== -1 ? index : 0,
    });
  } else {
    window.open(image.link, "_blank");
  }
};

async function uploadFilesSequentially(files: any) {
  for (const file of files) {
    if (!file) {
      continue;
    }

    // Check if the file is an image
    if (file.type.startsWith("image/")) {
      new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.4,
          async success(result) {
            try {
              await dbStore.store(dbStore.folder, "Installation", result);
              filesUploaded.value++;
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          error(err) {
            console.log(err.message);
            reject(err);
          },
        });
      });

      await sleep(1000);
    } else {
      try {
        dbStore.store(dbStore.folder, "Installation", file);
        filesUploaded.value++;
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      await sleep(1000);
    }
  }
}

const saveFiles = async (files: any) => {
  isUploading.value = true;
  selectedFilesLength.value = files.length;

  uploadFilesSequentially(files)
    .then(async () => {
      // await leadsStore.updateStatus({
      //   leadId: leadsStore.selectedLead.id,
      //   status: "Survey Done",
      //   comments: "All files were uploaded to dropbox.",
      // });

      setTimeout(() => {
        dbStore.getInstallationPictures(dbStore.folder);
        EventBus.$emit("refresh-lead-data");
      }, 2000);
    })
    .catch((error) => {
      console.error("Error uploading files:", error);
    })
    .finally(() => {
      //
    });
};

const onDrop = (acceptFiles: any, rejectReasons: any) => saveFiles(acceptFiles);

const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: ["image/*", "video/*", "application/pdf"],
});

onMounted(async () => {
  EventBus.$on("refresh-installation-pictures", () => {
    dbStore.getInstallationPictures(dbStore.folder);
  });

  await dbStore.create(`${dbStore.folder}/Installation`);
  dbStore.getInstallationPictures(dbStore.folder);
});

const filteredResults = computed(() => {
  if (selectedTags.value.length < 1) {
    return dbStore.installationImages;
  }

  return dbStore.installationImages.filter((image: any) =>
    selectedTags.value.some((name) => image.name.includes(name))
  );
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
          Installation Pictures ( {{ dbStore.installationImages.length }} )
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

      <VCardTitle v-if="isUploading">
        <span> Uploaded {{ filesUploaded }} / {{ selectedFilesLength }} </span>
      </VCardTitle>

      <VDivider />

      <VCardItem>
        <div class="d-flex flex-wrap" :style="{ gap: '10px' }">
          <VTooltip
            v-for="additional in ADDITIONAL.LEADS.INSTALLATION_IMAGE_LABELS"
          >
            <template #activator="{ props }">
              <VChip
                @click="selectTag(additional)"
                class="ring"
                v-bind="props"
                :color="
                  dbStore.installationFileNames.includes(
                    `${leadsStore.selectedLead.reference_number} - ${additional}`
                  )
                    ? 'secondary'
                    : 'error'
                "
                :variant="
                  selectedTags.includes(additional) ? 'flat' : 'outlined'
                "
              >
                {{ additional }}
              </VChip>
            </template>
            <span>
              {{
                dbStore.installationFileNames.includes(
                  `${leadsStore.selectedLead.reference_number} - ${additional}`
                )
                  ? "Uploaded"
                  : "Not uploaded"
              }}
            </span>
          </VTooltip>
        </div>
      </VCardItem>
    </VCard>

    <VRow class="mt-4">
      <VCol v-if="filteredResults.length < 1" cols="12">
        <VCard title="No image(s) found." />
      </VCol>

      <VCol
        v-for="image in (filteredResults as any)"
        v-else
        :key="image.id"
        class="image-card px-3"
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

        <VCard v-else>
          <VTooltip>
            <template #activator="{ props }">
              <div v-bind="props">
                <VRow @click="show(image)">
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
                </VRow>
              </div>
            </template>
            <span>Click to preview</span>
          </VTooltip>
          <VRow>
            <VCol
              class="d-flex justify-start align-center pa-3"
              cols="12"
              @click.stop
            >
              <div style="flex-basis: 100%">
                <rename-select-file-dialog
                  type="Installation Pictures"
                  :imageData="{
                    id: image.id,
                    fileName: image.name,
                    filePath: image.path_display,
                  }"
                />
              </div>
            </VCol>
          </VRow>
        </VCard>
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
