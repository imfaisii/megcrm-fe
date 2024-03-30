<script lang="ts" setup>
import { ADDITIONAL } from "@/constants/general";
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { generateRandomString, getExtension } from "@/utils/useHelper";
import { requiredValidator } from "@validators";

const props = defineProps(["imageData"]);

const enableSaveButton = ref(false);
const isLoading = ref(false);
const store = useDropboxStore();
const leadsStore = useLeadsStore();
const name: any = ref(null);
const firstName: any = ref(null);
const oldName: any = ref(null);
const path: any = ref(null);
const ext: any = ref("");
const formRef = ref();

const reset = () => {
  name.value = null;
  path.value = null;
  oldName.value = null;
  ext.value = "";
};

watch(name, (newValue, oldValue) => {
  if (newValue !== null && newValue !== firstName.value) {
    enableSaveButton.value = true;
  }
});

const handleSubmit = async () => {
  isLoading.value = true;

  if (name.value.toLowerCase() === "extras") {
    name.value += `- ${generateRandomString(4)}`;
  }

  const nameWithExtension = `${name.value}.${ext.value}`;

  await store.renameFile(
    path.value,
    path.value.replace(
      oldName.value,
      `${
        leadsStore.selectedLead.reference_number
      } - ${nameWithExtension.replace(
        `${leadsStore.selectedLead.reference_number} - `,
        ""
      )}`
    ),
    nameWithExtension
  );

  store.folderImages = store.folderImages.filter(
    (entry: any) => entry.id !== props.imageData.id
  );

  enableSaveButton.value = false;
  isLoading.value = false;
  EventBus.$emit("refresh-survey-pictures");
};

onMounted(() => {
  ext.value = getExtension(props?.imageData?.fileName);
  oldName.value = props?.imageData?.fileName;
  name.value = props?.imageData?.fileName.replace(`.${ext.value}`, "");
  firstName.value = name.value;
  path.value = props?.imageData?.filePath;
});
</script>

<template>
  <VForm ref="formRef" @submit.prevent="handleSubmit">
    <VCol cols="12">
      <VCombobox
        v-model="name"
        :rules="[requiredValidator]"
        :items="ADDITIONAL.LEADS.SURVEY_IMAGE_LABELS"
        label="Name"
        placeholder="File Name"
        clearable
        required
      />
    </VCol>
    <VCol>
      <VBtn
        @click="handleSubmit"
        :disabled="!enableSaveButton"
        :loading="isLoading"
        >Save</VBtn
      >
    </VCol>
  </VForm>
</template>
