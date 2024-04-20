<script lang="ts" setup>
import useApiFetch from "@/composables/useApiFetch";
import useDataTable from "@/composables/useDatatable";
import useTime from "@/composables/useTime";
import { useToast } from "@/plugins/toastr";
import router from "@/router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { usePermissionsStore } from "@/stores/permissions/usePermissionsStore";
import { mergeProps } from "vue";
import { strTruncated } from "../../utils/useHelper";

export type Comment = {
  leadId: Number | String;
  status: String;
  comments: String;
};

// Headers
const headers = [
  { title: "Name", key: "first_name" },
  { title: "Address", key: "plain_address" },
  { title: "Post Code", key: "post_code" },
  { title: "Lead Generator", key: "lead_generator_id", sortable: false },
  { title: "Survey Booked By", key: "id", sortable: false },
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
  surveyor_id: [],
  timestamp: "",
  address: "",
  reference_number: "",
  survey_booked_by: [],
});

const isCommentsDialogVisible = ref(false);

const form = reactive<Comment>({
  leadId: "",
  status: "",
  comments: "",
});

// composables
let SelectedNumberForCall: string = ref("");
const store: any = useLeadsStore();
const body = ref("");
const isConfirmDialogVisible = ref(false);
let isDialCall = true;
const auth: any = useAuthStore();
const permStore: any = usePermissionsStore();
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

  const routeData = router.resolve({
    name: "leads-edit-id-tab",
    params: { id: itemId, tab: "customer-details" },
  });

  window.open(routeData.href, "_blank");
};

onMounted(async () => {
  await store.getExtras();
});

const airCallLoader = ref(false);

const toast = useToast();
const fixNumber = (str: string): string => str.replace(/\D/g, "").slice(-10);

const handleAirCall = async (lead: any) => {
  try {
    if (!lead?.phone_no) {
      toast.error("phone number invalid");
      return;
    }
    store.selectedId = lead.id;
    airCallLoader.value = true;
    /* before making a call i need to make another call to check the stats of this number and check whether someone else has called it or not */
    let { data: oldCalls } = await useApiFetch("/aircall/search-call", {
      data: {
        phone_number: "+44" + fixNumber(lead?.phone_no ?? ""),
      },
      method: "POST",
    });
    SelectedNumberForCall.value = "+44" + fixNumber(lead?.phone_no ?? "");
    const myCallerId = auth?.user?.air_caller_id;
    oldCalls = oldCalls.filter(function (obj: any) {
      /* check if some one else has called it or not */
      if (!obj.user) {
        return false; // if its an inbound then it should not be included
      }
      return myCallerId != obj?.user?.id;
    });

    if (oldCalls.length > 0) {
      console.log(oldCalls);

      const otherCallersNames = oldCalls
        ?.map(function (obj: any) {
          return obj.user.name;
        })
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index // make uniquness of name
        )
        .join(", ");

      console.log(`output->others`, otherCallersNames);

      body.value = `This person is already called by ${otherCallersNames}. would you still like to call this customer`;
      isConfirmDialogVisible.value = true;
      // means someone has called it and its not me
      return;
    }

    if (isDialCall) {
      return makeDialCall(SelectedNumberForCall.value);
    } else {
      return false;
    }
  } catch (err: any) {
    console.log(err);
    toast.error(err.response?.data?.message ?? "Something Went Wrong!");
  } finally {
    store.selectedId = null;
    airCallLoader.value = false;
  }
};

const makeDialCall = async (phone_no: string) => {
  try {
    airCallLoader.value = true;
    const { data, message } = await useApiFetch("/aircall/dial-call", {
      data: {
        phone_number: "+44" + fixNumber(phone_no),
      },
      method: "POST",
    });
    toast.success("AirCall Success");
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? "Something Went Wrong!");
  } finally {
    airCallLoader.value = false;
  }
};

const handleSwalCallback = (response: boolean) => {
  if (response) {
    makeDialCall(SelectedNumberForCall.value);
  }
};
</script>

<template>
  <!-- Filters -->
  <VRow class="pa-4">
    <VCol cols="12" lg="4">
      <VTextField
        v-model="filters.name"
        label="Name"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField
        v-model="filters.post_code"
        label="Post code"
        clearable
        density="compact"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField
        v-model="filters.reference_number"
        label="Reference Number"
        clearable
        density="compact"
      />
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
        density="compact"
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
        density="compact"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VAutocomplete
        v-model="filters.survey_booked_by"
        :items="store.csrs"
        label="Survey Booked By"
        placeholder="Select User"
        item-title="name"
        item-value="id"
        chips
        multiple
        clearable
        :return-object="false"
        density="compact"
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
        density="compact"
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
        density="compact"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VTextField
        v-model="filters.address"
        label="Address"
        clearable
        density="compact"
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
    <!-- @vue-expect-error -->
    <template #item.first_name="{ item }">
      {{ item.raw.full_name }}
    </template>

    <!-- Address -->
    <!-- @vue-expect-error -->
    <template #item.plain_address="{ item }">
      <VTooltip>
        <template #activator="{ props }">
          <div v-bind="props">{{ strTruncated(item.raw.address, 20) }}</div>
        </template>
        {{ item.raw.address }}
      </VTooltip>
    </template>

    <!-- Lead Generator -->
    <!-- @vue-expect-error -->
    <template #item.lead_generator_id="{ item }">
      <VTooltip>
        <template #activator="{ props }">
          <div class="font-italic" v-bind="props">
            {{
              strTruncated(
                item.raw?.lead_generator?.name ?? "No lead generator",
                10
              )
            }}
          </div>
        </template>
        {{ item.raw?.lead_generator?.name ?? "No lead generator" }}
      </VTooltip>
    </template>

    <!-- Survey Booked By -->
    <!-- @vue-expect-error -->
    <template #item.id="{ item }">
      <VBtn
        class="text-white"
        variant="elevated"
        size="x-small"
        :color="
          store.getColorOfSurveyBookers(store.getNameOfSurveyBookers(item))
        "
        readonly
      >
        {{ store.getNameOfSurveyBookers(item) }}
      </VBtn>
    </template>

    <!-- Status -->
    <!-- @vue-expect-error -->
    <template #item.status_details="{ item }">
      <VMenu>
        <template v-slot:activator="{ props: menu }">
          <VTooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <VBtn
                class="text-white"
                size="x-small"
                :color="
                  item.raw?.status_details?.lead_status_model?.color ??
                  'primary'
                "
                v-bind="mergeProps(menu, tooltip)"
              >
                {{
                  item.raw?.status_details?.name?.toUpperCase() ?? "No status"
                }}
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
            v-for="(status, index) in store.leadTableStatuses"
            :key="`${item.raw.id}-${index}`"
          >
            {{ status.name }}
          </VListItem>
        </VList>
      </VMenu>
    </template>

    <!-- Created At -->
    <!-- @vue-expect-error -->
    <template #item.created_at="{ item }">
      <p>{{ time.formatDate(item.raw.created_at, "DD/MM/YYYY") }}</p>
    </template>

    <!-- Actions -->
    <!-- @vue-expect-error -->
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
      <VTooltip location="bottom">
        <template #activator="{ props }">
          <IconBtn @click.stop="handleAirCall(item.raw)" v-bind="props">
            <VProgressCircular
              v-if="
                airCallLoader &&
                (store.selectedId === item.raw.id ||
                  SelectedNumberForCall ===
                    `+44` + fixNumber(item?.raw?.phone_no ?? ''))
              "
              size="24"
              color="info"
              indeterminate
            />
            <VIcon v-else color="info" icon="mdi-phone-dial-outline" />
          </IconBtn>
        </template>
        <span>Open The Aircall App And Put this Number on Dial Pad</span>
      </VTooltip>
    </template>
  </DataTable>

  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    cancel-title="Action Cancelled"
    confirm-title="Alert!"
    confirm-msg="Sure, Proceeding...."
    :confirmation-question="body"
    cancel-msg="Some Other Customer is waiting for you 😺."
    @confirm="handleSwalCallback"
  />

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
