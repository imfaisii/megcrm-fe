<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import useTime from "@/composables/useTime";
import router from "@/router";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
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

// filters
const filters = ref({
  name: "",
  phone_no: "",
  post_code: "",
  statuses: [],
  lead_generator_id: [],
  timestamp: "",
});

const isCommentsDialogVisible = ref(false);

const form = reactive<Comment>({
  leadId: "",
  status: "",
  comments: "",
});

// composables
const store: any = useLeadsStore();
const time = useTime();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchLeads({ include: "leadGenerator" })
);

const handleCommentsSubmit = async (comments: String) => {
  form.comments = comments;
  await store.updateStatus(form);
  await store.fetchLeads({ include: "leadGenerator" });
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
  store.isLoading = true;

  router.push({ name: "leads-edit-id", params: { id: itemId } });
};

onMounted(async () => {
  await store.getExtras();
  await store.fetchLeads({ include: "leadGenerator" });
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
      <VCombobox
        v-model="filters.statuses"
        :items="store.tableStatuses"
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
      <VCombobox
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
  </VRow>

  <!-- Table-->
  <DataTable
    :store="store"
    :items="store.leads"
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

    <!-- Lead Generator -->
    <template #item.lead_generator_id="{ item }">
      <div class="pa-2">
        <VBadge
          :color="item.raw?.lead_generator?.name ? 'success' : 'info'"
          inline
        >
          <template #badge>
            <div class="pa-2">
              {{ item.raw?.lead_generator?.name ?? "Not assigned" }}
            </div>
          </template>
        </VBadge>
      </div>
    </template>

    <!-- Status -->
    <template #item.status_details="{ item }">
      <VMenu>
        <template v-slot:activator="{ props: menu }">
          <VTooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <VBtn
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
            v-for="(status, index) in store.tableStatuses"
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
      <!-- <VTooltip location="bottom">
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
      </VTooltip> -->
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
