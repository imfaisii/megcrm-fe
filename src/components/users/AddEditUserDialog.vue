<script setup lang="ts">
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { EventBus } from "@/utils/useEventBus";
import { emailValidator, requiredValidator } from "@validators";
import { VForm } from "vuetify/components/VForm";

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

const permissionsStore: any = usePermissionsStore();
const label = computed(() => (props.store.isSelected ? "Update" : "Create"));
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

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
  if (props.store.isSelected) {
    await props.store.update(props.store.selectedId, props.store.selected);
  } else {
    await props.store.store(props.store.selected);
  }
};

const closeDialog: any = () => {
  emit("update:isDialogVisible", false);

  setTimeout(() => props.store.reset(), 500);
};

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
              v-model="store.selected.name"
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
              v-model="store.selected.email"
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
              v-model="store.selected.password"
              :rules="[!store.isSelected && requiredValidator]"
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
              v-model="store.selected.password_confirmation"
              :rules="[!store.isSelected && requiredValidator]"
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
              v-model="store.selected.is_active"
              label="Status"
              :items="statuses"
              item-value="key"
              item-title="value"
              :menu-props="{ maxHeight: 200 }"
            />
          </VCol>

          <!-- Roles -->
          <VCol v-if="showRoles" cols="12">
            <VLabel class="mb-2"><strong>Roles</strong></VLabel>
            <VRow>
              <VCol
                cols="12"
                lg="4"
                v-for="role in permissionsStore.roles"
                :key="`role-${role.id}`"
              >
                <VCheckbox
                  v-model="store.selected.roles"
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
