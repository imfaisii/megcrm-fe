<script setup lang="ts">
import ScrollToTop from "@core/components/ScrollToTop.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig();

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme();
syncConfigThemeWithVuetifyTheme();
handleSkinChanges();
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <RouterView />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>

<style>
.no-x-padding {
  padding-inline: 0 !important;
}

.v-field:has(input[required]) .v-label {
  padding-inline-end: 8px;
}

.v-field:has(input[required]) .v-label::after {
  position: absolute;
  color: red;
  content: "*";
  inset-block-start: 0;
  inset-inline-end: 0;
}

.v-toast {
  z-index: 9999999 !important;
}

.v-pagination__item--is-active {
  /* stylelint-disable-next-line liberty/use-logical-spec */
  margin-top: 2px !important;
}
</style>
