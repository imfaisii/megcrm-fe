<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import useTime from "@/composables/useTime";
import router from "@/router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useLeadJobsStore } from "@/stores/leads/useLeadJobsStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { mergeProps } from "vue";

export type Comment = {
  leadId: Number | String;
  status: String;
  comments: String;
};

// Headers
const headers = [
  { title: "Name", key: "first_name" },
  { title: "Phone", key: "phone_no" },
  { title: "Post Code", key: "post_code" },
  { title: "Lead Generator", key: "lead_generator_id", sortable: false },
  { title: "Status", key: "status_details", sortable: false },
  { title: "Date", key: "created_at" },
  { title: "Actions", key: "actions", sortable: false },
];

const props = defineProps({
  filters: {
    required: false,
    type: Object as any,
    default: () => {},
  },
});

// filters
const filters = ref({
  name: "",
  phone_no: "",
  post_code: "",
  statuses: [],
  lead_generator_id: [],
  surveyor_id: [],
  timestamp: "",
  address: "",
  reference_number: "",
  ...props.filters,
});

const isCommentsDialogVisible = ref(false);

const form = reactive<Comment>({
  leadId: "",
  status: "",
  comments: "",
});

// composables
const store: any = useLeadsStore();
const auth: any = useAuthStore();
const permStore: any = usePermissionsStore();
const leadJobStore: any = useLeadJobsStore();
const time = useTime();
const { onSortChange, onPaginationChange } = useDataTable(
  leadJobStore,
  filters,
  () => leadJobStore.fetchLeads({ include: "leadGenerator" })
);

const handleCommentsSubmit = async (comments: String) => {
  form.comments = comments;

  await store.updateStatus(form);
  await leadJobStore.fetchLeads({ include: "leadGenerator" });
};

const onStatusSelect = (leadId: any, status: any) => {
  form.leadId = leadId;
  form.status = status;

  isCommentsDialogVisible.value = true;
};

const onRowClick = ($event: PointerEvent, item: any) => {
  handleRedirect(item.item.raw.id);
};

const handleRedirect = (itemId: any) => {
  store.selectedId = itemId;

  const routeData = router.resolve({
    name: "leads-edit-id-tab",
    params: { id: itemId, tab: "customer-details" },
  });

  window.open(routeData.href, "_blank");
};

onMounted(async () => {
  await store.getExtras();
});
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="4">
      <VTextField v-model="filters.name" label="Name" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField v-model="filters.phone_no" label="Phone No" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField v-model="filters.post_code" label="Post code" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VAutocomplete
        v-model="filters.statuses"
        :items="store.leadTableStatuses"
        label="Status"
        placeholder="Select status"
        item-title="name"
        item-value="name"
        chips
        multiple
        clearable
        :return-object="false"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VAutocomplete
        v-model="filters.lead_generator_id"
        :items="store.leadGenerators"
        label="Lead Generator"
        placeholder="Select Lead Genrator"
        item-title="name"
        item-value="id"
        chips
        multiple
        clearable
        :return-object="false"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VAutocomplete
        v-model="filters.surveyor_id"
        :items="store.surveyors"
        label="Surveyor"
        placeholder="Select surveyor"
        item-title="name"
        item-value="id"
        chips
        multiple
        clearable
        :return-object="false"
        :disabled="permStore.isSurveyorOnly"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <AppDateTimePicker
        v-model="filters.timestamp"
        :config="{
          mode: 'range',
          wrap: true,
          altInput: true,
          altFormat: 'F j, Y',
          dateFormat: 'Y-m-d',
        }"
        label="Dated"
        placeholder="Select date"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField v-model="filters.address" label="Address" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField
        v-model="filters.reference_number"
        label="Reference Number"
        clearable
      />
    </VCol>
  </VRow>

  <!-- Table-->
  <DataTable
    :store="leadJobStore"
    :items="leadJobStore.leads"
    :headers="headers"
    class="text-no-wrap"
    show-select
    @click:row="onRowClick"
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
  >
    <!-- Name -->
    <template #item.first_name="{ item }">
      {{ item.raw.full_name }}
    </template>

    <!-- Email -->
    <template #item.email="{ item }">
      <a class="email-color" :href="`mailto:${item.raw.email}`">
        {{ item.raw.email }}
      </a>
    </template>

    <!-- Post code -->
    <template #item.post_code="{ item }">
      <VTooltip>
        <template #activator="{ props }">
          <div v-bind="props">{{ item.raw.post_code }}</div>
        </template>
        <span>{{ item.raw.address }}</span>
      </VTooltip>
    </template>

    <!-- Lead Generator -->
    <template #item.lead_generator_id="{ item }">
      <div class="font-italic">
        {{ item.raw?.lead_generator?.name ?? "No lead generator" }}
      </div>
    </template>

    <!-- Status -->
    <template #item.status_details="{ item }">
      <VMenu>
        <template v-slot:activator="{ props: menu }">
          <VTooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <VBtn
                :class="
                  (item.raw?.status_details?.name
                    .toUpperCase()
                    .includes('CANCELLED') ||
                    item.raw?.status_details?.lead_status_model?.color ==
                      '#FF0000') &&
                  'text-white'
                "
                size="x-small"
                :color="
                  item.raw?.status_details?.lead_status_model?.color ??
                  'primary'
                "
                v-bind="mergeProps(menu, tooltip)"
              >
                {{ item.raw?.status_details?.name.toUpperCase() }}
              </VBtn>
            </template>
            <span>
              {{ item.raw?.status_details?.reason }}
              {{
                item?.raw?.status_details?.user &&
                `by ${
                  item.raw.status_details?.user?.name ?? "System"
                } at ${time.formatDate(item.raw.status_details?.created_at)}`
              }}
            </span>
          </VTooltip>
        </template>
        <VList>
          <VListItem
            @click="onStatusSelect(item.raw.id, status.name)"
            v-for="(status, index) in store.leadJobTableStatuses"
            :key="`${item.raw.id}-${index}`"
          >
            {{ status.name }}
          </VListItem>
        </VList>
      </VMenu>
    </template>

    <!-- Created At -->
    <template #item.created_at="{ item }">
      <p>{{ time.formatDate(item.raw.created_at, "DD/MM/YYYY") }}</p>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="handleRedirect(item.raw.id)">
            <VProgressCircular
              v-if="store.isLoading && store.selectedId === item.raw.id"
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else icon="tabler-edit" />
          </IconBtn>
        </template>
        <span>View Lead Details</span>
      </VTooltip>
      <VTooltip
        v-if="auth.user.email == 'cfaysal099@gmail.com'"
        location="bottom"
      >
        <template #activator="{ props }">
          <IconBtn @click="store.deleteLead(item.raw.id)" v-bind="props">
            <VProgressCircular
              v-if="store.isLoading && store.selectedId === item.raw.id"
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span>Are you sure you want to delete this lead?</span>
      </VTooltip>
    </template>
  </DataTable>

  <!-- Dialogs -->
  <CommentsDialog
    v-model:is-comments-dialog-visible="isCommentsDialogVisible"
    v-model:is-loading="store.isLoading"
    @on-dialog-close="isCommentsDialogVisible = false"
    @on-comments-update="handleCommentsSubmit"
  />
</template>

<style lang="scss" scoped>
.email-color {
  color: "#4FC3F7";
}
</style>
