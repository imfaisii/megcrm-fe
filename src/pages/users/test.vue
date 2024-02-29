<script setup lang="ts">
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { useUsersStore } from "@/stores/users/useUsersStore";
import { emailValidator, requiredValidator } from "@core/utils/validators";
import { VForm } from "vuetify/components/VForm";

const numberedSteps = [
  {
    title: "Account Details",
    subtitle: "Setup Account Details",
  },
  {
    title: "Personal Info",
    subtitle: "Add personal information",
  },
  {
    title: "Roles",
    subtitle: "Manage User Role(s)",
  },
  {
    title: "Documents",
    subtitle: "Manage User Files",
  },
];

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

const permissionsStore = usePermissionsStore();
const leadsStore = useLeadsStore();
const store = useUsersStore();
const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const isCurrentStepValid = ref(true);
const refAccountForm = ref<VForm>();

const isCsrSelected = computed(() => {
  return permissionsStore.hasRole(store.selected.roles, "csr");
});

const handleSubmit = () => {
  // refAccountForm.value?.validate().then(async (valid) => {
  // if (valid.valid) {
  try {
    // await store.store(store.selected);

    currentStep.value++;
    isCurrentStepValid.value = true;
  } catch (e) {
    isCurrentStepValid.value = false;
    //
  }
  // } else {
  //   isCurrentStepValid.value = false;
  // }
  // });
};

onMounted(async () => {
  await permissionsStore.getRoles();
  await leadsStore.getExtras();

  // EventBus.$on("toggle-users-dialog", (type: any) => {
  //   emit("update:isDialogVisible", type);
  // });
});
</script>

<template>
  <VCard>
    <VCardText>
      <!-- Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        align="start"
        :is-active-step-valid="store.isSelected"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <VCol class="mb-4" cols="12">
            <h6 class="text-sm font-weight-medium">Account Information</h6>
            <p class="text-xs mb-0">
              Enter below details to create an account.
            </p>
          </VCol>

          <VForm ref="refAccountForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- Name -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.name"
                  :rules="[requiredValidator]"
                  label="Name"
                  placeholder="John Doe"
                  required
                  :error-messages="store?.errors?.name?.[0]"
                />
              </VCol>

              <!-- Email -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  required
                  placeholder="johndoe@email.com"
                  :error-messages="store?.errors?.email?.[0]"
                />
              </VCol>

              <!-- Password -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.password"
                  :rules="[!store.isSelected && requiredValidator]"
                  label="New Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible
                      ? 'mdi-eye-off-outline'
                      : 'mdi-eye-outline'
                  "
                  :error-messages="store?.errors?.password?.[0]"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  required
                />
              </VCol>

              <!-- Password Confirmation -->
              <VCol cols="12" md="6">
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
                  required
                />
              </VCol>

              <!-- Submit -->
              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn color="secondary" variant="tonal" disabled>
                    <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn
                    :loading="store.isLoading"
                    :disabled="store.isLoading"
                    type="submit"
                  >
                    Next
                    <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VCol class="mb-4" cols="12">
            <h6 class="text-sm font-weight-medium">Personal Information</h6>
            <p class="text-xs mb-0">Add more desccription about user.</p>
          </VCol>

          <VForm ref="refPersonalForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- Status -->
              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="store.selected.is_active"
                  label="Status"
                  :items="statuses"
                  item-value="key"
                  item-title="value"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol>

              <!-- Gender -->
              <VCol cols="12" lg="6">
                <VSelect
                  v-model="store.selected.additional.gender"
                  :rules="[requiredValidator]"
                  :items="store.GENDERS"
                  label="Gender"
                  placeholder="Male"
                  :error-messages="store?.errors?.gender?.[0]"
                />
              </VCol>

              <!-- DOB -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.additional.dob"
                  type="date"
                  label="Date of birth"
                  placeholder="01/01/1998"
                  :error-messages="store?.errors?.dob?.[0]"
                />
              </VCol>

              <!-- Visa Expiry -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.additional.visa_expiry"
                  type="date"
                  label="Visa Expiry Date"
                  placeholder="01/01/1998"
                  :error-messages="store?.errors?.visa_expiry?.[0]"
                />
              </VCol>

              <!-- Phone -->
              <VCol cols="12" lg="6">
                <VTextField
                  v-model="store.selected.additional.phone_no"
                  label="Phone"
                  placeholder="XXX-XXXXXXX"
                  type="number"
                  clearable
                />
              </VCol>

              <!-- National Insurance Number -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.additional.nin"
                  label="National Insurance Number"
                  placeholder="TR00111001"
                  :error-messages="store?.errors?.nin?.[0]"
                />
              </VCol>

              <!-- Bank Name -->
              <VCol cols="12" md="6">
                <VCombobox
                  v-model="store.selected.additional.bank"
                  :items="leadsStore.banks"
                  item-value="name"
                  item-title="name"
                  label="Bank Name"
                  placeholder="Natwest"
                  :return-object="false"
                  :error-messages="store?.errors?.bank_id?.[0]"
                />
              </VCol>

              <!-- Account Number -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="store.selected.additional.account_number"
                  label="Account Number"
                  placeholder="00-00-12345678"
                  :error-messages="store?.errors?.account_number?.[0]"
                />
              </VCol>

              <!-- Address -->
              <VCol cols="12">
                <VTextarea
                  v-model="store.selected.additional.address"
                  label="Address"
                  placeholder="103 House Example Street..."
                  auto-grow
                  clearable
                  counter
                />
              </VCol>

              <!-- Submit -->
              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn
                    @click="currentStep--"
                    color="secondary"
                    variant="tonal"
                  >
                    <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VCol class="mb-4" cols="12">
            <h6 class="text-sm font-weight-medium">Roles</h6>
            <p class="text-xs mb-0">Manage User Roles</p>
          </VCol>

          <VForm ref="refSocialLinkForm" @submit.prevent="handleSubmit">
            <VRow>
              <VCol class="d-flex justify-space-between" cols="12">
                <VCheckbox
                  v-for="role in (permissionsStore.roles as any)"
                  :key="`role-${role.id}`"
                  v-model="store.selected.roles"
                  :label="role.formatted_name"
                  :value="role.id"
                  dense
                >
                </VCheckbox>
              </VCol>

              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn color="success" type="submit"> submit </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
