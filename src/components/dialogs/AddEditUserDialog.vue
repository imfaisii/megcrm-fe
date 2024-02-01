<script setup lang="ts">
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { useUsersStore } from "@/stores/users/useUsersStore";
import { EventBus } from "@/utils/useEventBus";
import { emailValidator, requiredValidator } from "@validators";
import { VForm } from "vuetify/components/VForm";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
}

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits<Emit>();

const store = useUsersStore();
const permissionsStore = usePermissionsStore();
const label = computed(() => (store.isUserSelected ? "Update" : "Create"));
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const form = reactive<any>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  is_active: true,
  roles: [],
});

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

const handleSubmit = async () => {
  if (store.isUserSelected) {
    await store.updateUser(form);
  } else {
    await store.storeUser(form);
  }
};

const closeDialog: any = () => {
  emit("update:isDialogVisible", false);

  setTimeout(() => {
    store.selectedUser = null;
    store.errors = {};
  }, 500);
};

watch(
  props,
  () => {
    form.name = store.isUserSelected ? store.selectedUser.name : "";
    form.email = store.isUserSelected ? store.selectedUser.email : "";
    form.is_active = store.isUserSelected ? store.selectedUser.is_active : true;
    form.roles = store.isUserSelected
      ? store.selectedUser.roles.map((r: any) => r.id)
      : [];
    form.password = "";
    form.password_confirmation = "";
  },
  { deep: true }
);

onMounted(async () => {
  await permissionsStore.getRoles();

  EventBus.$on("toggle-users-dialog", (type: any) => {
    emit("update:isDialogVisible", type);
  });
});

onUnmounted(() => EventBus.$off("toggle-users-dialog"));
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="isDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> {{ label }} User </VCardTitle>
      </VCardItem>

      <!-- Form -->
      <VForm class="mt-3" @submit.prevent="handleSubmit">
        <VRow>
          <!-- Name -->
          <VCol cols="12" lg="6">
            <VTextField
              v-model="form.name"
              :rules="[requiredValidator]"
              autofocus
              label="Name"
              placeholder="John Doe"
              :error-messages="store?.errors?.name?.[0]"
            />
          </VCol>

          <!-- Email -->
          <VCol cols="12" lg="6">
            <VTextField
              v-model="form.email"
              :rules="[requiredValidator, emailValidator]"
              label="Email"
              type="email"
              placeholder="johndoe@email.com"
              :error-messages="store?.errors?.email?.[0]"
            />
          </VCol>

          <!-- Password -->
          <VCol cols="12" lg="6">
            <VTextField
              v-model="form.password"
              :rules="[!store.isUserSelected && requiredValidator]"
              label="New Password"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="
                isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
              "
              :error-messages="store?.errors?.password?.[0]"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
          </VCol>

          <!-- Password Confirmation -->
          <VCol cols="12" lg="6">
            <VTextField
              v-model="form.password_confirmation"
              :rules="[!store.isUserSelected && requiredValidator]"
              label="Confirm Password"
              placeholder="············"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="
                isConfirmPasswordVisible
                  ? 'mdi-eye-off-outline'
                  : 'mdi-eye-outline'
              "
              @click:append-inner="
                isConfirmPasswordVisible = !isConfirmPasswordVisible
              "
            />
          </VCol>

          <!-- Status -->
          <VCol cols="12">
            <VSelect
              v-model="form.is_active"
              label="Status"
              :items="statuses"
              item-value="key"
              item-title="value"
              :menu-props="{ maxHeight: 200 }"
            />
          </VCol>

          <!-- Roles -->
          <VCol cols="12">
            <VLabel class="mb-2"><strong>Roles</strong></VLabel>
            <VRow>
              <VCol
                cols="12"
                lg="4"
                v-for="role in permissionsStore.roles"
                :key="`role-${role.id}`"
              >
                <VCheckbox
                  v-model="form.roles"
                  :label="role.formatted_name"
                  :value="role.id"
                  dense
                >
                </VCheckbox>
              </VCol>
            </VRow>
          </VCol>

          <!-- Actions button -->
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn
              type="submit"
              :disabled="store.isLoading"
              :loading="store.isLoading"
            >
              {{ label }} User
            </VBtn>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VRow>
      </VForm>
    </VCard>
  </VDialog>
</template>
