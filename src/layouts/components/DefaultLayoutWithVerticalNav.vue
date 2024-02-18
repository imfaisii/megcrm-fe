<script lang="ts" setup>
import navItems from "@/navigation/vertical";
import { useThemeConfig } from "@core/composable/useThemeConfig";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavBarNotifications from "@/layouts/components/NavBarNotifications.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

// @layouts plugin
import env from "@/constants/env";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { VerticalNavLayout } from "@layouts";

const {
  appRouteTransition,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavCollapsed,
  isAppRtl,
} = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const store: any = usePermissionsStore();

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref<
  null | "rotate-180" | "rotate-back-180"
>(null);

const handleFileDownload = async () => {
  const url = `${env.VITE_APP_API_URL}/leads-datamatch-download`;

  window.location.href = url;
};

watch(
  [isVerticalNavCollapsed, isAppRtl],
  (val) => {
    if (isAppRtl.value)
      verticalNavHeaderActionAnimationName.value = val[0]
        ? "rotate-back-180"
        : "rotate-180";
    else
      verticalNavHeaderActionAnimationName.value = val[0]
        ? "rotate-180"
        : "rotate-back-180";
  },
  { immediate: true }
);
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          id="vertical-nav-toggle-btn"
          class="ms-n3"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <NavbarThemeSwitcher />
        <!-- <VTooltip v-if="store.can(['leads.download-datamatch'])"> -->
        <VTooltip>
          <template #activator="{ props }">
            <IconBtn
              @click="handleFileDownload"
              class="blink-animate"
              v-bind="props"
            >
              <VIcon icon="mdi-download" />
            </IconBtn>
          </template>
          <span>Click to download Datamatch file.</span>
        </VTooltip>

        <VSpacer />

        <NavBarNotifications class="me-3" />
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition :name="appRouteTransition" mode="out-in">
        <div>
          <Component :is="Component" />
        </div>
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
@keyframes rotate-180 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

@keyframes rotate-back-180 {
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.layout-vertical-nav {
  .nav-header {
    .header-action {
      animation-duration: 0s;
      animation-duration: 0.35s;
      animation-fill-mode: forwards;
      animation-name: v-bind(verticalNavHeaderActionAnimationName);
      transform: rotate(0deg);
    }
  }
}
</style>
