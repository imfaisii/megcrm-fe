<script setup lang="ts">
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { EventBus } from "@/utils/useEventBus";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
}

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: false,
    required: false,
  },
  showRoles: {
    type: Boolean,
    default: true,
    required: false,
  },
  store: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits<Emit>();

const leadsStore = useLeadsStore();
const showAircallEmailField = ref(false);
const showInstallationTypesField = ref(false);
const formRef = ref();
const permissionsStore: any = usePermissionsStore();
const label = computed(() => (props.store.isSelected ? "Update" : "Create"));
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const file = ref();
const fileName = ref(null);
const uploadingFile = ref(false);
const documentsWhileCreating = ref([]);

const statuses = [
  {
    key: true,
    value: "Active",
  },
  {
    key: false,
    value: "Inactive",
  },
];

const handleUploadFile = async () => {
  try {
    uploadingFile.value = true;
    await props.store.uploadFile(
      props.store.selectedId,
      file.value[0],
      fileName.value
    );
    fileName.value = null;
    file.value = null;

    //@ts-ignore
    document.activeElement.blur();
    await props.store.get(props.store.selected.id);
  } catch (e: any) {
    //
  } finally {
    uploadingFile.value = false;
  }
};

const handleSubmit = async () => {
  formRef.value.validate().then(async (v: any) => {
    if (props.store.isSelected) {
      await props.store.update(props.store.selectedId, props.store.selected);
    } else {
      props.store.selected.documents = documentsWhileCreating.value;
      await props.store.store(props.store.selected);
    }
    // }
  });
};

const closeDialog: any = () => {
  emit("update:isDialogVisible", false);

  setTimeout(() => props.store.reset(), 500);
};

watch(
  () => props.store.selected.roles,
  (n) => {
    showAircallEmailField.value = permissionsStore.hasRole(n, "csr");
    showInstallationTypesField.value = permissionsStore.hasRole(n, "installer");
  },
  { deep: true }
);

onMounted(async () => {
  await permissionsStore.getRoles();
  await leadsStore.getExtras();

  EventBus.$on("toggle-users-dialog", (type: any) => {
    emit("update:isDialogVisible", type);
  });
});

onUnmounted(() => EventBus.$off("toggle-users-dialog"));
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 1600"
    :model-value="isDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <TestComponent />
  </VDialog>
</template>
