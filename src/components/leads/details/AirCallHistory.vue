<script setup lang="ts">
import useTime from "@/composables/useTime";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import avatar1 from "@images/avatars/avatar-4.png";

const leadStore = useLeadsStore();
const time = useTime();
const isDialogVisible = ref(false);
</script>

<template>
  <VCard title="Call History" class="pa-5">
    <VCardText>
      <VList lines="two" class="air-call-history-list card-list">
        <template #default>
          <VAlert class="mb-4" border="start" color="info" variant="tonal">
            Enter an
            <v-icon>
              <v-tooltip activator="parent" location="start">
                <span
                  >164 numbers are formatted [+] [country code] [subscriber
                  number including area code] and can have a maximum of fifteen
                  digits</span
                >
              </v-tooltip>
              mdi-information-outline
            </v-icon>
            E.164 Format Number to get the history
          </VAlert>

          <section>
            <VRow>
              <VCol cols="12">
                <VCard class="air-call-search-card">
                  <BoilersTable />
                </VCard>
              </VCol>
            </VRow>
          </section>

          <VTable class="mt-4" fixed-header>
            <thead>
              <tr>
                <th class="text-uppercase">Call No</th>
                <th class="text-uppercase">Caller Name</th>
                <th class="text-uppercase">Details</th>
                <th class="text-uppercase">Comments</th>
                <th class="text-uppercase">Status</th>
              </tr>
            </thead>

            <tbody class="text-high-emphasis">
              <tr v-if="leadStore.selectedLead.call_centers < 1">
                <td
                  class="font-italic font-weight-medium text-center"
                  colspan="4"
                >
                  No records found.
                </td>
              </tr>
              <tr
                v-else
                v-for="(callRecord, index) in leadStore.selectedLead
                  .call_centers"
              >
                <td>
                  <p>#{{ index + 1 }}</p>
                </td>
                <td>
                  <p class="font-weight-medium">
                    {{ callRecord.created_by.name }}
                  </p>
                </td>
                <td>
                  <div class="d-flex align-center my-3">
                    <VAvatar rounded :size="38" :image="avatar1" class="me-3" />

                    <div>
                      <VListItemTitle class="text-sm font-weight-medium mb-1">
                        Call with {{ leadStore.selectedLead.full_name }}
                      </VListItemTitle>

                      <VListItemSubtitle
                        class="text-xs text-no-wrap d-flex align-center"
                      >
                        <VIcon start :size="16" icon="mdi-calendar-blank" />
                        <span>
                          {{ time.formatDate(callRecord.created_at) }}
                        </span>
                      </VListItemSubtitle>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-button font-italic">
                    {{ callRecord?.comments ?? "No comments." }}
                  </p>
                </td>
                <td>
                  <div class="mt-3">
                    <VChip
                      size="x-small"
                      color="primary"
                      :text="callRecord?.call_center_status?.name"
                    />

                    <div v-if="callRecord?.is_call_scheduled">
                      <p class="font-italic mt-2">
                        Call scheduled at:
                        {{ time.formatDate(callRecord?.call_scheduled_time) }}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
        </template>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5625rem;
}
</style>

<style lang="scss">
.meeting-schedule-list {
  .v-list-item__append {
    block-size: 100%;
  }
}
</style>
