<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { getProgressColor } from "@/utils/useHelper";
import { requiredValidator } from "@validators";

const store = useLeadsStore();
const route = useRoute();

const activeTab = ref(route.params.tab);

const tabs = [
  {
    title: "Customer Details",
    icon: "mdi-account-outline",
    tab: "customer-details",
  },
  {
    title: "Book Survey",
    icon: "mdi-home-plus-outline",
    tab: "book-survey",
  },
  {
    title: "Survey Pictures",
    icon: "mdi-image-marker-outline",
    tab: "survey-pictures",
  },
  {
    title: "Pre Checking",
    icon: "mdi-image-check-outline",
    tab: "pre-checking",
  },
  { title: "Communications", icon: "mdi-phone-outline", tab: "communications" },
  { title: "History", icon: "mdi-clock-outline", tab: "history" },
  {
    title: "Coming soon...",
    icon: "mdi-clock-alert-outline",
  },
];

const isDialogVisible = computed(() => !store.isLeadSelected);
const isCommentsDialogVisible = ref(false);
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
    include: store.includes.join(","),
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

  EventBus.$on("refresh-lead-data", async () => await getLead());
});

onUnmounted(() => {
  store.selectedLead = null;

  EventBus.$off("refresh-lead-data");
});
</script>

<template>
  <section>
    <div v-if="!isDialogVisible">
      <VRow no-gutters>
        <VCol cols="12">
          <VCard class="mb-6">
            <VCardTitle>
              <div
                class="d-flex align-center flex-wrap justify-space-between pa-2"
              >
                <p>Lead Details</p>

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
              </div>
            </VCardTitle>

            <VCardText>
              <VRow>
                <VCol class="d-flex flex-wrap">
                  <VTooltip>
                    <template #activator="{ props }">
                      <VChip
                        v-bind="props"
                        label
                        size="small"
                        class="text-capitalize mb-2 ml-0"
                        color="warning"
                      >
                        {{ store.selectedLead.address }}
                      </VChip>
                    </template>
                    <span>Customer Address</span>
                  </VTooltip>
                  <VTooltip>
                    <template #activator="{ props }">
                      <VChip
                        v-bind="props"
                        label
                        size="small"
                        class="text-capitalize mb-2 blink-animate ml-0"
                        color="warning"
                      >
                        {{ store.selectedLead.status_details.name }}
                      </VChip>
                    </template>
                    <span>Current Lead Status</span>
                  </VTooltip>
                </VCol>
              </VRow>

              <VRow class="d-flex mb-3">
                <LeadAlertMessages
                  v-if="store.selectedLead.post_code"
                  :postCode="store.selectedLead.post_code"
                  :address="store.selectedLead.address"
                />
              </VRow>

              <VRow>
                <VCol class="d-flex flex-wrap align-center" cols="12">
                  <VAutocomplete
                    v-model="store.selectedLead.status_details.name"
                    :items="
                      store.selectedLead.is_marked_as_job
                        ? store.leadJobTableStatuses
                        : store.leadTableStatuses
                    "
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
                    <template #prepend-inner>
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
                  </VAutocomplete>

                  <VBtn @click="isCommentsDialogVisible = true">
                    Save Status
                  </VBtn>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VTabs v-model="activeTab" class="v-tabs-pill">
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
          :value="tab.tab"
          :to="{
            name: 'leads-edit-id-tab',
            params: { id: route.params.id, tab: tab.tab },
          }"
          :disabled="tab?.tab ? false : true"
        >
          <VIcon start :size="24" :icon="tab.icon" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
      <VDivider />

      <VWindow
        v-model="activeTab"
        class="mt-5 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem value="customer-details">
          <CustomerDetailsForm />
        </VWindowItem>

        <VWindowItem value="book-survey">
          <BookSurvey />
        </VWindowItem>

        <VWindowItem value="survey-pictures">
          <SurveyPictures />
        </VWindowItem>

        <VWindowItem value="pre-checking">
          <PreCheckingTab />
        </VWindowItem>

        <VWindowItem value="communications">
          <CallCenterTab />
        </VWindowItem>

        <VWindowItem value="history">
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
                  v-else-if="store.showEditButton"
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
