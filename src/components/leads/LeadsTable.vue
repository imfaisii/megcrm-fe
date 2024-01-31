<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { mergeProps } from "vue";

type Comment = {
  leadId: Number | String;
  status: String;
  comments: String;
};

// Headers
const headers = [
  { title: "Name", key: "first_name" },
  { title: "Email", key: "email" },
  { title: "Post Code", key: "post_code" },
  { title: "Lead Generator", key: "lead_generator_id", sortable: false },
  { title: "Status", key: "status_details", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

// filters
const filters = ref({
  email: "",
  post_code: "",
  statuses: [],
  lead_generator_id: [],
});

const isCommentsDialogVisible = ref(false);

const form = reactive<Comment>({
  leadId: "",
  status: "",
  comments: "",
});

// composables
const store: any = useLeadsStore();
const { onSortChange, onPaginationChange } = useDataTable(
  store,
  filters,
  store.fetchLeads
);

const handleCommentsSubmit = async (comments: String) => {
  form.comments = comments;
  await store.updateStatus(form);
};

const onStatusSelect = (leadId: any, status: any) => {
  form.leadId = leadId;
  form.status = status;

  isCommentsDialogVisible.value = true;
};

onMounted(async () => {
  await store.getExtras();
  await store.fetchLeads({ include: "leadGenerator" });
});
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="3">
      <VTextField v-model="filters.email" label="Email address" clearable />
    </VCol>

    <VCol cols="12" lg="3">
      <VTextField v-model="filters.post_code" label="Post code" clearable />
    </VCol>

    <VCol cols="12" lg="3">
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

    <VCol cols="12" lg="3">
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
  </VRow>

  <!-- Table-->
  <DataTable
    :store="store"
    :items="store.leads"
    :headers="headers"
    class="text-no-wrap"
    show-select
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

    <!-- Marked as Job -->
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
                  item.raw?.status_details?.lead_status?.color ?? 'primary'
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
                `by ${item.raw.status_details.user.name} at ${item.raw.status_details.lead_status.created_at}`
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

    <!-- Actions -->
    <template #item.actions="{ item }">
      <!-- <IconBtn :to="{ name: 'leads-edit-id', params: { id: item.raw.id } }">
        <VIcon icon="tabler-edit" />
      </IconBtn> -->
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="store.deleteLead(item.raw.id)">
            <VIcon color="error" icon="tabler-trash" />
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
