<script lang="ts" setup>
import { ADDITIONAL } from "@/constants/general";
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { getExtension } from "@/utils/useHelper";
import { requiredValidator } from "@validators";

const props = defineProps({
  type: {
    type: String,
    default: () => "Survey Pictures",
  },
  imageData: {
    type: Object,
    required: true,
  },
});

const isLoading = ref(false);
const store = useDropboxStore();
const leadsStore = useLeadsStore();
const name: any = ref(null);
const firstName: any = ref(null);
const oldName: any = ref(null);
const path: any = ref(null);
const ext: any = ref("");

const handleSubmit = async (selectedName: string) => {
  name.value = selectedName;
  isLoading.value = true;

  const nameWithExtension = `${name.value}.${ext.value}`;

  const response = await store.renameFile(
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

  if (props.type === "Survey Pictures") {
    const entryIndex = store.folderImages.findIndex(
      (i: any) => i.id === props.imageData.id
    );

    if (entryIndex !== -1) {
      store.folderImages[entryIndex] = response;
    }

    EventBus.$emit("refresh-survey-pictures");
  } else {
    const entryIndex = store.installationImages.findIndex(
      (i: any) => i.id === props.imageData.id
    );

    if (entryIndex !== -1) {
      store.installationImages[entryIndex] = response;
    }

    EventBus.$emit("refresh-installation-pictures");
  }
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
  <VForm>
    <VCol cols="12">
      <VSelect
        v-model="name"
        :rules="[requiredValidator]"
        :items="
          ADDITIONAL.LEADS.INSTALLATION_IMAGE_LABELS.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )
        "
        label="Name"
        placeholder="File Name"
        required
      >
        <template v-slot:item="{ item, props }">
          <div
            @click="handleSubmit(item.title)"
            v-bind="props"
            class="v-list-item v-list-item--link v-theme--light v-list-item--density-default v-list-item--one-line v-list-item--variant-text"
            tabindex="0"
          >
            <span class="v-list-item__overlay"></span
            ><span class="v-list-item__underlay"></span>
            <div class="v-list-item__prepend"><!----></div>
            <div class="v-list-item__content" data-no-activator="">
              <div class="v-list-item-title">
                {{ item.title }}
              </div>
            </div>
          </div>
        </template>
      </VSelect>
    </VCol>
  </VForm>
</template>
