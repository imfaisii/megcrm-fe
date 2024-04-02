<script lang="ts">
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSkins } from "@core/composable/useSkins";

export default defineComponent({
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    onMounted(async () => {
      await auth.fetchUser();

      if (auth.isLoggedIn && auth.isOtpVerified) {
        router.push("/dashboard");
      } else if (auth.isLoggedIn && !auth.isOtpVerified) {
        router.push("/two-step");
      }
    });

    const routerView = resolveComponent("router-view");
    const { injectSkinClasses } = useSkins();

    // ℹ️ This will inject classes in body tag for accurate styling
    injectSkinClasses();

    return () =>
      h("div", { class: "layout-wrapper layout-blank" }, h(routerView));
  },
});
</script>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
