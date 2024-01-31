<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { requiredValidator } from "@validators";

const store = useLeadsStore();
const route = useRoute();

const includes = ["leadGenerator"];
const leadStatusForm = ref({
  status: "",
});

const updateStatus = () => {
  alert("update");
};

onMounted(async () => {
  await store.getExtras();
  await store.fetchLead(route.params.id as any, {
    include: includes.join(","),
  });
});
</script>

<template>
  <section v-if="store.isLeadSelected">
    <VCard title="Lead Status" class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" lg="8">
            <VCombobox
              v-model="leadStatusForm.status"
              :items="store.leadStatuses"
              :rules="[requiredValidator]"
              label="Lead Status"
              placeholder="Select Status"
              type="text"
              item-value="id"
              item-title="name"
              clearable
              required
              :return-object="false"
            >
              <!-- Prepend -->
              <template #prepend>
                <VTooltip location="bottom">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-help-circle-outline" />
                  </template>
                  You can update the lead status directly from here.
                </VTooltip>
              </template>

              <!-- AppendInner -->
              <!-- <template #append-inner>
                <VFadeTransition leave-absolute>
                  <VProgressCircular
                    v-if="loading"
                    size="24"
                    color="info"
                    indeterminate
                  />
                </VFadeTransition>
              </template> -->

              <!-- Append -->
              <template #append>
                <VBtn
                  :size="$vuetify.display.smAndDown ? 'small' : 'large'"
                  :class="$vuetify.display.smAndDown ? 'mt-n2' : 'mt-n3'"
                  :icon="$vuetify.display.smAndDown"
                  @click="updateStatus"
                >
                  Update Status
                  <!-- <VIcon icon="mdi-map-search-outline" /> -->
                </VBtn>
              </template>
            </VCombobox>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>
</template>
