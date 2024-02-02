<script lang="ts" setup>
import { useLeadGeneratorsStore } from "@/stores/lead-generators/useLeadGeneratorsStore";
import { EventBus } from "@/utils/useEventBus";

const store = useLeadGeneratorsStore();
const isAddNameOnlyDialogVisible: any = ref(false);
const includes = ["createdBy"];

const onNameFormSubmit = async (form: any) => {
  if (store.selected.id) {
    await store.update(store.selected.id, form);
  } else {
    await store.store(form);
  }

  await store.fetchAll({ include: includes.join(",") });
};

onMounted(() => {
  EventBus.$on("item-selected", () => {
    isAddNameOnlyDialogVisible.value = true;
  });
});

onUnmounted(() => {
  EventBus.$off("item-selected");
});
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard class="leads-card">
          <VCardTitle class="pl-4 pr-4 mt-3 mb-2">
            <VRow class="text-layout">
              <VCol cols="6" class="text-left">
                <h6 class="text-h5">Lead Generators Table</h6>
              </VCol>
              <VCol cols="6" class="text-right">
                <VBtn
                  @click="isAddNameOnlyDialogVisible = true"
                  color="primary"
                >
                  Create Lead Generator
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>

          <LeadGeneratorsTable />
        </VCard>
      </VCol>
    </VRow>
  </section>

  <AddNameOnlyDialog
    v-model:is-name-only-dialog-visible="isAddNameOnlyDialogVisible"
    title="Lead Generators"
    :store="store"
    @on-form-submitted="onNameFormSubmit"
  />
</template>
