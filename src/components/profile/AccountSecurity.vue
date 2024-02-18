<script lang="ts" setup>
import { useToast } from "@/plugins/toastr";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useUsersStore } from "@/stores/users/useUsersStore";
import { VDataTable } from "vuetify/labs/VDataTable";

const auth: any = useAuthStore();
const usersStore: any = useUsersStore();
const $toast = useToast();
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const isOneTimePasswordDialogVisible = ref(false);

const passwordRequirements = [
  "Minimum 8 characters long - the more, the better",
  "At least one lowercase character",
  "At least one number, symbol, or whitespace character",
];

const recentDevicesHeaders = [
  { title: "BROWSER", key: "browser" },
  { title: "DEVICE", key: "device" },
  { title: "LOCATION", key: "location" },
  { title: "RECENT ACTIVITY", key: "recentActivity" },
];

const recentDevices = [
  {
    browser: "Chrome on Windows",
    device: "Dell XPS 15",
    location: "New York, NY",
    recentActivity: "28 Apr 2022, 18:20",
    deviceIcon: { icon: "mdi-laptop", color: "warning" },
  },
  {
    browser: "Chrome on Android",
    device: "Google Pixel 3a",
    location: "Los Angeles, CA",
    recentActivity: "20 Apr 2022, 10:20",
    deviceIcon: { icon: "mdi-android", color: "success" },
  },
  {
    browser: "Chrome on iPhone",
    device: "iPhone 12x",
    location: "San Francisco, CA",
    recentActivity: "16 Apr 2022, 04:20",
    deviceIcon: { icon: "mdi-cellphone", color: "error" },
  },
  {
    browser: "Chrome on MacOS",
    device: "Apple iMac",
    location: "New York, NY",
    recentActivity: "28 Apr 2022, 18:20",
    deviceIcon: { icon: "mdi-monitor", color: "info" },
  },
  {
    browser: "Chrome on MacOs",
    device: "Macbook Pro",
    location: "Los Angeles, CA",
    recentActivity: "20 Apr 2022, 10:20",
    deviceIcon: { icon: "mdi-laptop", color: "warning" },
  },
  {
    browser: "Chrome on Android",
    device: "Oneplus 9 Pro",
    location: "San Francisco, CA",
    recentActivity: "16 Apr 2022, 04:20",
    deviceIcon: { icon: "mdi-android", color: "success" },
  },
];

const handleSubmit = async () => {
  try {
    await usersStore.updateProfile(auth.user.id, {
      current_password: auth.user.current_password,
      password: auth.user.password,
      password_confirmation: auth.user.password_confirmation,
    });

    auth.user.current_password = null;
    auth.user.password = null;
    auth.user.password_confirmation = null;
  } catch (e: any) {
    //
  }
};
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm @submit.prevent="handleSubmit">
          <VCardText class="pt-0">
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="auth.user.current_password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible
                      ? 'mdi-eye-off-outline'
                      : 'mdi-eye-outline'
                  "
                  :error-messages="usersStore?.errors?.current_password?.[0]"
                  label="Current Password"
                  placeholder="············"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="auth.user.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible
                      ? 'mdi-eye-off-outline'
                      : 'mdi-eye-outline'
                  "
                  :error-messages="usersStore?.errors?.password?.[0]"
                  label="New Password"
                  placeholder="············*"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model="auth.user.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible
                      ? 'mdi-eye-off-outline'
                      : 'mdi-eye-outline'
                  "
                  :error-messages="
                    usersStore?.errors?.password_confirmation?.[0]
                  "
                  label="Confirm New Password"
                  placeholder="············"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText>
            <p class="text-base">Password Requirements:</p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon size="7" icon="mdi-circle" class="me-3" />
                </div>
                <span class="text-base">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              type="submit"
              :loading="usersStore.isLoading"
              :disabled="usersStore.isLoading"
            >
              Save changes
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Recent Devices -->
    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard title="Recent Devices">
        <VDataTable
          :headers="recentDevicesHeaders"
          :items="recentDevices"
          hide-default-footer
          class="text-no-wrap rounded-0 text-sm"
        >
          <template #item.browser="{ item }">
            <div class="d-flex align-center">
              <VIcon
                start
                :icon="item.raw.deviceIcon.icon"
                :color="item.raw.deviceIcon.color"
                size="20"
              />
              <span class="text-base text-high-emphasis">
                {{ item.raw.browser }}
              </span>
            </div>
          </template>
          <!-- TODO Refactor this after vuetify provides proper solution for removing default footer -->
          <template #bottom />
        </VDataTable>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
