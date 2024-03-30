<script setup lang="ts">
import { useGenerateImageVariant } from "@/@core/composable/useGenerateImageVariant";
import useApiFetch from "@/composables/useApiFetch";
import { useToast } from "@/plugins/toastr";

import authV1RegisterMaskDark from "@images/pages/auth-v1-register-mask-dark.png";
import authV1RegisterMaskLight from "@images/pages/auth-v1-register-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { ref } from "vue";

const authV1ThemeTwoStepMask = useGenerateImageVariant(
  authV1RegisterMaskLight,
  authV1RegisterMaskDark
);
const toast = useToast();
const OTPCODE = ref(null);
const loader = ref(false);
const resendOTP = async () => {
  try {
    loader.value = true;

    const { data } = await useApiFetch("/OTP-GENERATE", {
      data: {},
      method: "POST",
    });
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    loader.value = false;
  }
};

const OTPCheck = async () => {
  try {
    loader.value = true;

    const { data } = await useApiFetch("/OTP-CHECK", {
      data: {
        OTP_Code: OTPCODE.value,
      },
      method: "POST",
    });
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    loader.value = false;
  }
};
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-2 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="me-n2">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-bold text-2xl text-capitalize">
          MegCRM
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">Two Step Verification 💬</h5>
        <p class="mb-2">
          We sent a verification code to your mobile and the email. Enter the
          code from the mobile in the field below.
        </p>
        <h6 class="text-base font-weight-medium">············1234</h6>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="OTPCheck">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <AppOtpInput @updateOtp="(value) => (OTPCODE = value)" />
            </VCol>

            <!-- reset password -->
            <VCol cols="12">
              <VBtn block type="submit"> Verify my Login </VBtn>
            </VCol>

            <!-- back to login -->
            <VCol cols="12">
              <div
                class="text-base d-flex justify-center align-center flex-wrap"
              >
                <span class="me-1">Didn't get the code?</span>
                <a class="cursor-pointer" @click="resendOTP()">Resend</a>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VImg
      :src="authV1ThemeTwoStepMask"
      class="d-none d-md-block auth-footer-mask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
