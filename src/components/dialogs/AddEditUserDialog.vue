<script setup lang="ts">
import { usePermissionsStore } from '@/stores/permissions/usePermission';
import { useUsersStore } from '@/stores/users/useUsersStore';
import { VForm } from 'vuetify/components/VForm';

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
}

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
})

const emit = defineEmits()

const usersStore = useUsersStore()
const permissionsStore = usePermissionsStore()

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const form = reactive<any>({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const statuses = [{
  key: true,
  value: 'Active'
}, {
  key: false,
  value: 'Inactive'
}]

const handleSubmit = async () => {
  await usersStore.storeUser(form)
}

const closeDialog: any = () => emit('update:isDialogVisible', false)

watch(
  props,
  () => {
    form.name = usersStore.isUserSelected ? usersStore.selectedUser.name : ''
    form.email = usersStore.isUserSelected ? usersStore.selectedUser.email : ''
    form.status = usersStore.isUserSelected ? usersStore.selectedUser.status : 'active'
    form.roles = usersStore.isUserSelected ? usersStore.selectedUser.roles.map((r: any) => r.id) : []
  },
  { deep: true },
)

onMounted(async () => await permissionsStore.getRoles())
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="isDialogVisible"
    @update:model-value="closeDialog">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> {{ false ? 'Edit' : 'Add New' }} User </VCardTitle>
        <p class="text-base mb-0">Set User Details</p>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- Form -->
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- Name -->
            <VCol cols="6">
              <VTextField v-model="form.name" autofocus label="Name" placeholder="John Doe"
                :error-messages="usersStore?.errors?.name?.[0]" />
            </VCol>

            <!-- Email -->
            <VCol cols="6">
              <VTextField v-model="form.email" autofocus label="Email" type="email" placeholder="johndoe@email.com"
                :error-messages="usersStore?.errors?.email?.[0]" />
            </VCol>

            <!-- Password -->
            <VCol cols="6">
              <VTextField v-model="form.password" autofocus label="New Password" placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :error-messages="usersStore?.errors?.password?.[0]"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </VCol>

            <!-- Password Confirmation -->
            <VCol cols="6">
              <VTextField v-model="form.password_confirmation" label="Confirm Password" placeholder="············"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
            </VCol>

            <!-- Status -->
            <VCol cols="12">
              <VSelect v-model="form.is_active" label="Status" :items="statuses" item-value="key" item-title="value"
                :menu-props="{ maxHeight: 200 }" />
            </VCol>

            <!-- Roles -->
            <VCol cols="12">
              <VLabel>Roles</VLabel>
              <VRow>
                <VCol cols="4" v-for="role in permissionsStore.roles" :key="`role-${role.id}`">
                  <VCheckbox v-model="form.roles" :label="role.formatted_name" :value="role.id" dense>
                  </VCheckbox>
                </VCol>
              </VRow>
            </VCol>

            <!-- Actions button -->
            <div class="d-flex align-center justify-center gap-3 mt-6">
              <VBtn type="submit" :disabled="usersStore.isLoading" :loading="usersStore.isLoading">
                Create User
              </VBtn>

              <VBtn color="secondary" variant="tonal" @click="closeDialog">
                Cancel
              </VBtn>
            </div>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
