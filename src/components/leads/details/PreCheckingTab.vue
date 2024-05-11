<script setup lang="ts">
import useTime from "@/composables/useTime";
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import { VIcon } from "vuetify/components";

const time = useTime();
const dbStore = useDropboxStore();
const store = useLeadsStore();
const isCommentsDialogVisible = ref(false);

const documents: any = ref([
  {
    title: "Proof of Benefit",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Proof of Address",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Proof of Ownership ( New Property )",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Land Registry",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Relationship Declaration",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Solicitor Letter ( New Property )",
    color: "primary",
    icon: "mdi-document",
  },
  {
    title: "Datamatch Consent",
    color: "primary",
    icon: "mdi-document",
  },
]);

watch(
  () => dbStore.precheckingDocuments,
  (n) => {
    if (n.length > 0) {
      documents.value = [
        ...documents.value,
        ...n.map((i: any) => {
          if (i.link) {
            return {
              title: i.name.split(".")[0],
              color: "primary",
              icon: "mdi-document",
            };
          }
        }),
      ];

      documents.value = [
        ...new Map(
          documents.value
            .filter((e: any) => e !== undefined)
            .map((item: any) => [item["title"], item])
        ).values(),
      ];
    }
  },
  { deep: true }
);

const handleCommentsSubmit = async (comments: String) => {
  try {
    await store.storeComments(store.selectedLead.id, {
      data: { comments: comments },
    });

    EventBus.$emit("refresh-lead-data");
  } catch (e) {
    //
  }
};

onMounted(async () => {
  await dbStore.create(`${dbStore.folder}/Pre Checking`);
  await dbStore.index(dbStore.folder, false);
  await dbStore.getPreCheckingFiles(dbStore.folder, true);
});
</script>

<template>
  <div>
    <!-- Picture Statistics -->
    <VCard class="mb-4">
      <VCardItem>
        <template #prepend>
          <VIcon icon="mdi-image-check" class="text-disabled" />
        </template>

        <VCardTitle>Pre Checking Details</VCardTitle>
      </VCardItem>

      <VDivider />
    </VCard>

    <section class="mb-4">
      <VRow>
        <VCol
          v-for="document in documents"
          :key="document.title"
          cols="12"
          lg="4"
        >
          <PreCheckingDocumentsCard v-bind="document" />
        </VCol>
        <VCol :key="`document-others`" cols="12" lg="4">
          <PreCheckingDocumentsCard
            v-bind="{ title: 'Others', color: 'success', icon: 'mdi-document' }"
          />
        </VCol>
      </VRow>
    </section>

    <!-- Checks -->
    <VCard class="mb-4">
      <VCardItem>
        <template #prepend>
          <VIcon icon="mdi-check-circle-outline" class="text-disabled" />
        </template>

        <VCardTitle>Additional Checks</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex justify-space-between">
        <VTooltip>
          <template #activator="{ props }">
            <div v-bind="props">
              <VCheckbox
                v-model="store.selectedLead.lead_additional.datamatch_confirmed"
                label="Datamatch Confirmed"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle"
                :color="
                  store.selectedLead.lead_additional.datamatch_confirmed
                    ? 'success'
                    : 'error'
                "
              />
            </div>
          </template>
          Mark as {{ !store.selectedLead.lead_additional.datamatch_confirmed }}
        </VTooltip>

        <VTooltip>
          <template #activator="{ props }">
            <div v-bind="props">
              <VCheckbox
                v-model="
                  store.selectedLead.lead_additional.land_registry_confirmed
                "
                label="Land Registry Confirmed"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle"
                :color="
                  store.selectedLead.lead_additional.land_registry_confirmed
                    ? 'success'
                    : 'error'
                "
              />
            </div>
          </template>
          Mark as
          {{ !store.selectedLead.lead_additional.land_registry_confirmed }}
        </VTooltip>

        <VTooltip>
          <template #activator="{ props }">
            <div v-bind="props">
              <VCheckbox
                v-model="
                  store.selectedLead.lead_additional.proof_of_address_confirmed
                "
                label="Proof of address Confirmed"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle"
                :color="
                  store.selectedLead.lead_additional.proof_of_address_confirmed
                    ? 'success'
                    : 'error'
                "
              />
            </div>
          </template>
          Mark as
          {{ !store.selectedLead.lead_additional.proof_of_address_confirmed }}
        </VTooltip>

        <VTooltip>
          <template #activator="{ props }">
            <div v-bind="props">
              <VCheckbox
                v-model="
                  store.selectedLead.lead_additional.epr_report_confirmed
                "
                label="EPR Report Confirmed"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle"
                :color="
                  store.selectedLead.lead_additional.epr_report_confirmed
                    ? 'success'
                    : 'error'
                "
              />
            </div>
          </template>
          Mark as {{ !store.selectedLead.lead_additional.epr_report_confirmed }}
        </VTooltip>

        <VTooltip>
          <template #activator="{ props }">
            <div v-bind="props">
              <VCheckbox
                v-model="
                  store.selectedLead.lead_additional
                    .gas_connection_before_april_2022
                "
                label="Gas connection before April 2022"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle"
                :color="
                  store.selectedLead.lead_additional
                    .gas_connection_before_april_2022
                    ? 'success'
                    : 'error'
                "
              />
            </div>
          </template>
          Mark as
          {{
            !store.selectedLead.lead_additional.gas_connection_before_april_2022
          }}
        </VTooltip>
      </VCardText>

      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTooltip>
              <template #activator="{ props }">
                <div v-bind="props">
                  <VCheckbox
                    v-model="
                      store.selectedLead.lead_additional
                        .is_pre_checking_confirmed
                    "
                    label="Pre checking for this job is verfied?"
                    true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle"
                    :color="
                      store.selectedLead.lead_additional
                        .is_pre_checking_confirmed
                        ? 'success'
                        : 'error'
                    "
                  />
                </div>
              </template>
              Mark as
              {{
                !store.selectedLead.lead_additional.is_pre_checking_confirmed
              }}
            </VTooltip>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Dialogs -->
    <CommentsDialog
      v-model:is-comments-dialog-visible="isCommentsDialogVisible"
      v-model:is-loading="store.isLoading"
      @on-dialog-close="isCommentsDialogVisible = false"
      @on-comments-update="handleCommentsSubmit"
    />

    <AddOtherDocument />
  </div>
</template>
