<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { getProgressColor } from "@/utils/useHelper";
import { requiredValidator } from "@validators";

const store = useLeadsStore();
const route = useRoute();

const activeTab = ref("customer-details");

const tabs = [
  {
    title: "Customer Details",
    icon: "mdi-account-outline",
    tab: "customer-details",
  },
  { title: "History", icon: "mdi-clock-outline", tab: "history" },
  {
    title: "Coming soon...",
    icon: "mdi-clock-alert-outline",
  },
];

const isDialogVisible = computed(() => !store.isLeadSelected);
const isCommentsDialogVisible = ref(false);
const includes = ["leadGenerator", "statuses", "leadCustomerAdditionalDetail"];
const appends = ["leads_logs"];

const handleCommentsSubmit = async (comments: string) => {
  await store.updateStatus({
    leadId: store.selectedLead.id,
    status: store.selectedLead.status_details.name,
    comments,
  });

  await getLead();
};

const getLead = async () => {
  store.selectedLead = null;

  await store.fetchLead(route.params.id as any, {
    include: includes.join(","),
    append: appends.join(","),
  });
};

const handleLeadUpdate = async () => {
  await store.update();
  await getLead();
};

onMounted(async () => {
  await store.getExtras();
  await getLead();
});

onUnmounted(() => (store.selectedLead = null));
</script>

<template>
  <section>
    <div v-if="!isDialogVisible">
      <VRow no-gutters>
        <VCol cols="12">
          <VCard title="Lead Status" class="mb-6">
            <template #append>
              <div class="d-flex flex-column-reverse ga-2 me-n3 mt-n2">
                <div class="d-flex justify-center">
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VProgressCircular
                        v-bind="props"
                        class="mr-4"
                        :rotate="360"
                        :size="70"
                        :width="6"
                        :model-value="25"
                        :color="getProgressColor(25)"
                      >
                        {{ "25" }}
                      </VProgressCircular>
                    </template>
                    Current Lead Progress
                  </VTooltip>
                </div>

                <VChip
                  label
                  size="small"
                  class="text-capitalize mb-2 blink-animate"
                  color="warning"
                >
                  {{ store.selectedLead.status_details.name }}
                </VChip>
              </div>
            </template>

            <VCardText>
              <VRow class="mb-3">
                <VCol cols="12">
                  <VCombobox
                    v-model="store.selectedLead.status_details.name"
                    :items="store.leadStatuses"
                    :rules="[requiredValidator]"
                    label="Lead Status"
                    placeholder="Select Status"
                    type="text"
                    item-value="name"
                    item-title="name"
                    clearable
                    required
                    :return-object="false"
                  >
                    <!-- Prepend -->
                    <template #prepend>
                      <VTooltip location="bottom">
                        <template #activator="{ props }">
                          <VIcon
                            v-bind="props"
                            icon="mdi-help-circle-outline"
                          />
                        </template>
                        Select the available statuses from the dropdown.
                      </VTooltip>
                    </template>

                    <!-- AppendInner -->
                    <template #append-inner>
                      <VFadeTransition leave-absolute>
                        <VProgressCircular
                          v-if="store.isLoading"
                          size="24"
                          color="info"
                          indeterminate
                        />
                      </VFadeTransition>
                    </template>

                    <!-- Append -->
                    <template #append>
                      <VBtn
                        :size="$vuetify.display.smAndDown ? 'small' : 'large'"
                        :class="$vuetify.display.smAndDown ? 'mt-n2' : 'mt-n3'"
                        :icon="$vuetify.display.smAndDown"
                        @click="isCommentsDialogVisible = true"
                      >
                        Update Status
                      </VBtn>
                    </template>
                  </VCombobox>
                </VCol>
              </VRow>

              <VRow>
                <LeadAlertMessages
                  class="mt-4"
                  v-if="store.selectedLead.post_code"
                  :postCode="store.selectedLead.post_code"
                  :address="store.selectedLead.address"
                />
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VTabs v-model="activeTab">
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
          :disabled="tab?.tab ? false : true"
        >
          <VIcon start :size="24" :icon="tab.icon" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
      <VDivider />

      <VWindow
        v-model="activeTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <CustomerDetailsForm />
        </VWindowItem>

        <VWindowItem>
          <ActivityTimeline
            :logs="store.selectedLead?.logs ?? []"
            :statuses="store.selectedLead?.statuses ?? []"
          />
        </VWindowItem>
      </VWindow>
    </div>

    <!-- Dialogs -->
    <VDialog v-model="isDialogVisible" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          <span class="mb-2 pb-2"> Loading lead... </span>
          <VProgressLinear indeterminate class="mt-2 mb-0" />
        </VCardText>
      </VCard>
    </VDialog>

    <CommentsDialog
      v-model:is-comments-dialog-visible="isCommentsDialogVisible"
      v-model:is-loading="store.isLoading"
      @on-dialog-close="isCommentsDialogVisible = false"
      @on-comments-update="handleCommentsSubmit"
    />

    <!-- Floating Button -->
    <VScaleTransition
      style="transform-origin: center"
      class="scroll-to-top d-print-none"
    >
      <VLayoutItem
        v-if="!isDialogVisible"
        model-value
        position="bottom"
        class="text-end"
        size="88"
      >
        <div class="ma-4">
          <VTooltip position="top">
            <template #activator="{ props }">
              <VFadeTransition leave-absolute>
                <VProgressCircular
                  v-if="store.isLoading"
                  size="24"
                  color="info"
                  indeterminate
                />

                <VBtn
                  v-else
                  @click="handleLeadUpdate"
                  v-bind="props"
                  icon="mdi-content-save-edit-outline"
                  size="large"
                  color="warning"
                  elevation="8"
                />
              </VFadeTransition>
            </template>
            Click to update lead details.
          </VTooltip>
        </div>
      </VLayoutItem>
    </VScaleTransition>
  </section>
</template>

<route lang="yaml">
meta:
  navActiveLink: leads
</route>
