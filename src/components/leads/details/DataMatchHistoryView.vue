<script lang="ts" setup>
import useTime from "@/composables/useTime";

const props = defineProps({
  logs: {
    required: false,
    default: () => [],
  },
  heading: {
    required: false,
    default: () => "Data Match History",
  },
  isWithinCard: {
    required: false,
    default: () => true,
  },
  elevation: {
    required: false,
    default: 3,
  },
});

const time = useTime();

const getTimeLineColor = (i: string): string => {
  if (i?.toLowerCase() === "not sent") return "error";
  if (i?.toLowerCase() === "matched") return "success";
  if (i?.toLowerCase() === "unverified") return "error";
  if (i?.toLowerCase() === "unmatched (verified)") return "warning";
  if (i?.toLowerCase() === "sent") return "info";

  return "info";
};
</script>

<template>
  <VCard :elevation="elevation">
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-format-list-bulleted" class="text-disabled" />
      </template>

      <VCardTitle>{{ props.heading }}</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VTimeline
        density="compact"
        align="start"
        truncate-line="start"
        :line-inset="12"
        class="v-timeline-density-compact my-timeline"
      >
        <VTimelineItem
          v-if="props.logs.length > 0"
          v-for="item in props.logs"
          :key="item.created_at"
          :dot-color="getTimeLineColor(item?.datamatch_progress)"
          size="x-small"
        >
          <div
            class="d-flex justify-space-between align-center flex-wrap gap-2 mb-1"
          >
            <span class="app-timeline-title mb-3">
              <span>
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <span v-bind="props"
                      >A <strong>{{ item.datamatch_progress }}</strong> result
                      was logged in system.</span
                    >
                  </template>
                  <span>{{ time.formatDate(item.created_at) }}</span>
                </VTooltip>
              </span>
            </span>
            <span class="app-timeline-meta">
              {{ time.diffForHumans(item.created_at) }}
            </span>
          </div>

          <p>
            {{ `The DataMatch For ` }}
            <strong>{{ `${item.first_name} ${item.last_name} ` }}</strong>
            {{
              ` with address ${item.address} and post code ${
                item.post_code
              } was Sent on ${time.formatDate(
                item.data_match_sent_date
              )} and the result was `
            }}
            <strong
              >{{
                `${item.datamatch_progress} on ${time.formatDate(
                  item.datamatch_progress_date
                )}`
              }}
            </strong>
          </p>
        </VTimelineItem>
        <VTimelineItem v-else>
          <p class="text-center">No records found.</p>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>

<style>
.my-timeline {
  max-height: 300px; /* Adjust the maximum height as needed */
  overflow-y: auto;
}
</style>
