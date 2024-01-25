<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import env from '@/constants/env'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import authV1LoginMaskDark from '@images/pages/auth-v1-login-mask-dark.png'
import authV1LoginMaskLight from '@images/pages/auth-v1-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const authV1ThemeLoginMask = useGenerateImageVariant(authV1LoginMaskLight, authV1LoginMaskDark)
const isPasswordVisible = ref(false)

const auth = useAuthStore()

async function handleSubmit() {
  const result = await v$.value.$validate()

  if (result)
    await auth.login(form)
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-2 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="me-n2">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold text-capitalize">
          {{ themeConfig.app.title }}
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Welcome to <span class="text-capitalize">{{ env.VITE_APP_NAME }}! 👋🏻</span>
        </h5>

        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                autofocus
                label="Email"
                type="email"
                placeholder="johndoe@email.com"
                :error-messages="v$?.email?.$errors[0]?.$message"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :error-messages="v$?.password?.$errors[0]?.$message"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <RouterLink
                  class="text-primary ms-2 mt-8"
                  :to="{ name: 'forgot-password' }"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VImg
      :src="authV1ThemeLoginMask"
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
