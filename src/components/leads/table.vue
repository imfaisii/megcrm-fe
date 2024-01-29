<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { mergeProps } from "vue";
import { removeEmptyAndNull } from "../../utils/useHelper";

const store: any = useLeadsStore();

// Headers
const headers = [
  { title: "Name", key: "full_name", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Phone No.", key: "phone_no", sortable: true },
  { title: "Post Code", key: "post_code", sortable: true },
  { title: "Marked As Job", key: "is_marked_as_job", sortable: true },
  { title: "Status", key: "status_details" },
  { title: "Actions", key: "actions", sortable: false },
];

const leadStatuses = [
  {
    key: "active",
    value: "Active",
    color: "success",
  },
  {
    key: "inactive",
    value: "Inactive",
    color: "error",
  },
];

const onPaginationChange = async ($event: any) => {
  store.meta.per_page = $event.pagination.per_page;
  store.meta.current_page = $event.pagination.current_page;
  store.meta.sort = $event.sort;

  await store.fetchLeads();
};

const onSortChange = async ($event: any) => {
  store.meta.sort = $event.sort;

  await store.fetchLeads();
};

const getStatusColor = (item: any) => {
  const entry = leadStatuses.find(
    (i) => i.key === item.raw.status_details.name
  );

  return entry?.color;
};

const isCommentsDialogVisible = ref(false);

const formRef = ref();
const filters = ref({
  email: "",
  postcode: "",
  statuses: [],
});
const form = reactive({
  leadId: "",
  status: "",
  comments: "",
});

const showCommentsDialog = (status: string, leadId: any) => {
  form.leadId = leadId;
  form.status = status;

  isCommentsDialogVisible.value = true;
};

const closeDialog = () => {
  isCommentsDialogVisible.value = false;

  form.leadId = "";
  form.status = "";
  form.comments = "";
};

const handleCommentsSubmit = async () => {
  const validation = await formRef.value.validate();

  if (validation?.valid) {
    await store.updateStatus(form);

    closeDialog();
  }
};

const debouncedRequest = useDebounceFn(
  async () => await store.fetchLeads(),
  1000
);

watch(
  filters.value,
  async (n) => {
    store.meta.filters = removeEmptyAndNull(n);

    await debouncedRequest();
  },
  { deep: true }
);

onMounted(async () => await store.fetchLeads());
</script>

<template>
  <!-- Filters -->

  <VRow class="pa-4">
    <VCol cols="12" lg="4">
      <VTextField v-model="filters.email" label="Email address" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField v-model="filters.post_code" label="Post code" clearable />
    </VCol>

    <VCol cols="12" lg="4">
      <VCombobox
        v-model="filters.statuses"
        :items="leadStatuses"
        label="Statuses"
        placeholder="Select statuses"
        item-title="value"
        item-value="key"
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
    <!-- Email -->
    <template #item.email="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <span class="text-sm text-medium-emphasis">{{ item.raw.email }}</span>
        </div>
      </div>
    </template>

    <!-- Marked as Job -->
    <template #item.is_marked_as_job="{ item }">
      <VBadge
        :color="item.raw.is_marked_as_job ? 'success' : 'warning'"
        :content="item.raw.is_marked_as_job ? 'Yes' : 'No'"
        inline
      />
    </template>

    <!-- Status -->
    <template #item.status_details="{ item }">
      <VMenu>
        <template v-slot:activator="{ props: menu }">
          <VTooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <VBtn
                :color="getStatusColor(item)"
                v-bind="mergeProps(menu, tooltip)"
              >
                {{ item.raw?.status_details?.name.toUpperCase() }}
              </VBtn>
            </template>
            <span>
              {{ item.raw?.status_details?.reason }}
              {{
                item?.raw?.status_details?.user &&
                `by ${item.raw.status_details.user.name}`
              }}
            </span>
          </VTooltip>
        </template>
        <VList>
          <VListItem
            @click="showCommentsDialog(status.key, item.raw.id)"
            v-for="(status, index) in leadStatuses"
            :key="`${item.raw.id}-${index}`"
            :disabled="item.raw.status_details.name === status.key"
          >
            {{ status.value }}
          </VListItem>
        </VList>
      </VMenu>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <VTooltip location="bottom">
        <template v-slot:activator="{ props: tooltip }">
          <IconBtn>
            <VIcon icon="tabler-eye" />
          </IconBtn>
        </template>
        <span> View Lead </span>
      </VTooltip>
      <VTooltip location="bottom">
        <template v-slot:activator="{ props: tooltip }">
          <IconBtn @click="store.deleteLead(item.raw.id)">
            <VIcon color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span> Are you sure you want to delete this lead? </span>
      </VTooltip>
    </template>
  </DataTable>

  <!-- Dialogs -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="isCommentsDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3"> Add Comments </VCardTitle>
      </VCardItem>

      <VForm ref="formRef" @submit.prevent="handleCommentsSubmit">
        <VCol cols="12">
          <VTextarea
            v-model="form.comments"
            :rules="[requiredValidator]"
            label="Comments"
            placeholder="Some comments..."
            auto-grow
            clearable
            counter
            required
          />
        </VCol>

        <VCol cols="12">
          <div class="d-flex align-center gap-3 mt-6">
            <VBtn
              type="submit"
              :disabled="store.isLoading"
              :loading="store.isLoading"
            >
              Update Status
            </VBtn>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VCol>
      </VForm>
    </VCard>
  </VDialog>
</template>
