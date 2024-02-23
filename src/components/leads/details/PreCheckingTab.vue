<script setup lang="ts">
// import CardStatisticsWeeklySales from "@/components/leads/details/PreCheckingTab.vue";
import useTime from "@/composables/useTime";
import { useDropboxStore } from "@/stores/dropbox/useDropboxStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { EventBus } from "@/utils/useEventBus";
import avatar2 from "@images/avatars/avatar-2.png";
import personWithCup from "@images/cards/illustration-1.png";
import { VIcon } from "vuetify/components";

const time = useTime();
const dbStore = useDropboxStore();
const store = useLeadsStore();
const isCommentsDialogVisible = ref(false);
const item = {
  slideImg: personWithCup,
  data: [
    {
      number: "24",
      text: "Boilers",
    },
    {
      number: "50",
      text: "Accessories",
    },
    {
      number: "12",
      text: "Tables",
    },
    {
      number: "38",
      text: "Home",
    },
    {
      number: "38",
      text: "Roof",
    },
    {
      number: "38",
      text: "Insulation",
    },
    {
      number: "38",
      text: "Top",
    },
    {
      number: "38",
      text: "Floor",
    },
  ],
};

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

        <VCardTitle>Pre Checking Details Details</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol class="d-flex justify-space-between" cols="12">
            <div>
              <h6 class="text-h6 mb-1">Pictures Report</h6>
              <p class="d-flex align-center gap-2 text-xs mb-0">
                <Skeleton
                  v-if="dbStore.loading"
                  height="0.5rem"
                  width="8rem"
                  borderRadius="16px"
                />

                <span v-else
                  >Total {{ dbStore.folderImages.length }} Pictures</span
                >
              </p>
            </div>

            <VBtn @click="isCommentsDialogVisible = true" size="small">
              Add Notes
            </VBtn>
          </VCol>

          <VCol cols="12" class="d-flex align-center gap-4">
            <img width="84" :src="item.slideImg" class="rounded" />

            <VRow no-gutters>
              <VCol
                v-for="d in item.data"
                :key="d.number"
                cols="3"
                class="text-no-wrap text-truncate text-xs pt-2"
              >
                <VChip label size="small" class="me-2">
                  {{ d.number }}
                </VChip>
                <span class="me-2">{{ d.text }}</span>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText v-if="store.selectedLead.comments.length > 0">
        <VTimeline
          v-for="comment in store.selectedLead.comments"
          :key="`comments-${comment.id}`"
          density="compact"
          align="start"
          truncate-line="start"
          :line-inset="12"
          class="v-timeline-density-compact"
        >
          <VTimelineItem size="x-small" dot-color="primary">
            <div class="d-flex justify-space-between flex-wrap mb-3">
              <h6 class="text-base font-weight-medium me-3">
                {{ comment.comment }}
              </h6>
              <small class="text-xs text-disabled text-no-wrap my-1">
                {{ time.diffForHumans(comment.created_at) }}
              </small>
            </div>

            <span class="d-flex align-bottom mt-2" :style="{ gap: '0.5rem' }">
              <VAvatar size="24" class="me-2" :image="avatar2" />

              <span class="text-sm font-weight-medium">
                {{ comment?.commentator?.name ?? "No Name" }}
                <VChip
                  label
                  color="info"
                  size="small"
                  class="text-capitalize ml-1"
                >
                  {{ comment?.commentator?.top_role ?? "No role" }}
                </VChip>
              </span>
            </span>
          </VTimelineItem>
        </VTimeline>
      </VCardText>
    </VCard>

    <section>
      <VCard class="mb-2">
        <VCardItem>
          <template #prepend>
            <VIcon icon="mdi-file-check-outline" class="text-disabled" />
          </template>

          <VCardTitle>Documents</VCardTitle>
        </VCardItem>

        <VDivider />
      </VCard>

      <VRow class="mt-4">
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
            v-bind="{ title: 'Others', color: 'primary', icon: 'mdi-document' }"
          />
        </VCol>
      </VRow>
    </section>

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
