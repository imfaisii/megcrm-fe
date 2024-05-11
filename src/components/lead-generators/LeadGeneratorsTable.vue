<script lang="ts" setup>
import useDataTable from "@/composables/useDatatable";
import { useLeadGeneratorsStore } from "@/stores/lead-generators/useLeadGeneratorsStore";
import { EventBus } from "@/utils/useEventBus";
import { strTruncated } from "../../utils/useHelper";

// Headers
const headers = [
  { title: "Name", key: "name" },
  { title: "SMS Sender Title", key: "sender_id" },
  { title: "Email Ref. SMS", key: "email" },
  { title: "Phone Ref. SMS", key: "phone_no" },
  { title: "Aircall No", key: "aircall_number" },
  {
    title: "Managers",
    key: "lead_generator_managers",
    sortable: false,
  },
  { title: "Added by", key: "created_by.name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const filters = ref({
  name: "",
  sender_id: "",
  email: "",
  phone_no: "",
});

// composables
const store: any = useLeadGeneratorsStore();
const { onSortChange, onPaginationChange } = useDataTable(store, filters, () =>
  store.fetchAll({ include: store.include.join(",") })
);

const handleView = (item: any) => {
  store.selected = item;

  EventBus.$emit("item-selected");
};

const onRowClick = ($event: PointerEvent, item: any) => {
  handleView(item.item.raw);
};
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.name"
        label="Name"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.sender_id"
        label="Sender Name"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.email"
        label="Email"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="filters.phone_no"
        label="Phone No"
        clearable
        density="compact"
      />
    </VCol>
  </VRow>

  <!-- Table-->
  <DataTable
    :store="store"
    :items="store.entries"
    :headers="headers"
    class="text-no-wrap"
    @click:row="onRowClick"
    @update:on-pagination-change="onPaginationChange"
    @update:on-sort-change="onSortChange"
  >
    <!-- @vue-expect-error -->
    <template #item.name="{ item }">
      <VTooltip postion="top">
        <template #activator="{ props }">
          <p v-bind="props" class="mb-0 font-italic">
            {{ strTruncated(item.raw.name, 15) }}
          </p>
        </template>
        <span>{{ item.raw.name }}</span>
      </VTooltip>
    </template>

    <!-- @vue-expect-error -->
    <template #item.email="{ item }">
      <VTooltip postion="top" :disabled="item?.raw?.email === null">
        <template #activator="{ props }">
          <p v-bind="props" class="mb-0 font-italic">
            {{ item?.raw?.email ? strTruncated(item.raw.email, 15) : "NULL" }}
          </p>
        </template>
        <span>{{ item.raw.email }}</span>
      </VTooltip>
    </template>

    <!-- @vue-expect-error -->
    <template #item.phone_no="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.phone_no ?? "NULL" }}</p>
    </template>

    <!-- @vue-expect-error -->
    <template #item.aircall_number="{ item }">
      <p class="mb-0 font-italic">{{ item?.raw?.aircall_number ?? "NULL" }}</p>
    </template>

    <!-- @vue-expect-error -->
    <template #item.lead_generator_managers="{ item }">
      <div class="d-flex align-center gap-4">
        <VAvatar
          v-if="item.raw.lead_generator_managers.length > 1"
          :size="30"
          color="primary"
          variant="tonal"
        >
          <VIcon :size="20" icon="tabler-user" />
        </VAvatar>
        <span
          :class="
            item.raw.lead_generator_managers.length > 1
              ? 'text-capitalize'
              : 'font-italic'
          "
        >
          {{
            item.raw.lead_generator_managers.length > 1
              ? `${item.raw.lead_generator_managers[0].name} ( +${
                  item.raw.lead_generator_managers.length - 1
                } )`
              : "No managers"
          }}
        </span>
      </div>
    </template>

    <!-- Actions -->
    <!-- @vue-expect-error -->
    <template #item.actions="{ item }">
      <IconBtn @click="handleView(item.raw)">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="store.destroy(item.raw.id)">
            <VProgressCircular
              v-if="
                store.isLoading &&
                store.selected?.id &&
                store.selected.id === item.raw.id
              "
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="error" icon="tabler-trash" />
          </IconBtn>
        </template>
        <span>Are you sure you want to delete this lead generator?</span>
      </VTooltip>
    </template>
  </DataTable>
</template>
