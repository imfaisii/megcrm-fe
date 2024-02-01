<script lang="ts" setup>
import { useToast } from "@/plugins/toastr";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { getExceptionMessage } from "@/utils/useHelper";
import avatar3 from "@images/avatars/avatar-3.png";
import {
  emailValidator,
  integerValidator,
  requiredValidator,
} from "@validators";
import axios from "axios";
import moment from "moment";
import { VForm } from "vuetify/components/VForm";

type Lead = {
  title: String | null;
  first_name: String | null;
  middle_name: String | null;
  last_name: String | null;
  email: String | null;
  phone_no: String | null;
  dob: String | null;
  address: String | null;
  post_code: String | null | undefined;
  comments: String | null;
  measures: Number[];
  job_type_id: Number | null;
  fuel_type_id: Number | null;
  benefit_type_id: Number | null;
  surveyor_id: Number | null;
  lead_generator_id: Number | null;
  lead_source_id: Number | null;
  has_second_receipent: Boolean;
  is_marked_as_job: Boolean;
  second_receipent: SecondReceipent;
};

type SecondReceipent = {
  first_name: String | null;
  middle_name: String | null;
  last_name: String | null;
  dob: String | null;
};

defineProps({
  isFullPage: {
    default: false,
    type: Boolean,
  },
});

const titles = ["Mr", "Mrs", "Ms"];
const $toast = useToast();
const store = useLeadsStore();

const steps = [
  {
    title: "Address",
    icon: "custom-wizard-address",
  },
  {
    title: "Basic Information",
    icon: "custom-wizard-personal",
  },
  {
    title: "Optional",
    icon: "custom-wizard-social-link",
  },
  {
    title: "Review & Submit",
    icon: "custom-wizard-submit",
  },
];

const addressCombobox = ref();
const loading = ref(false);
const suggestions: Ref<String[]> = ref([]);
const currentStep = ref(0);
const refPersonalForm = ref<VForm>();
const refAddressForm = ref<VForm>();
const refAdditionalInformationForm = ref<VForm>();
const refReviewForm = ref<VForm>();
const isCurrentStepValid = ref(true);
const isScotland = ref<Boolean>(false);

const personalInformationForm = ref({
  title: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  email: null,
  phone_no: null,
  dob: null,
});

const addressInformationForm = ref({
  address: null,
  post_code: null,
});

const additionalInformationForm = ref({
  comments: null,
  measures: [],
  job_type_id: null,
  fuel_type_id: null,
  benefit_type_id: null,
  surveyor_id: null,
  lead_generator_id: null,
  lead_source_id: null,
  has_second_receipent: false,
  is_marked_as_job: false,
  second_receipent: {
    first_name: null,
    middle_name: null,
    last_name: null,
    dob: null,
  },
});

const validatePersonalInformationForm = () => {
  refPersonalForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateAddressInformationForm = () => {
  refAddressForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateAdditionalInformationForm = () => {
  refAdditionalInformationForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const getSuggestions = async () => {
  if (!addressInformationForm.value.post_code) {
    $toast.error("Please enter postcode to proceed.");

    return;
  }

  const token = "kiU5H3-znEqPYUqKzOA4JQ41583";
  loading.value = true;
  suggestions.value = [];

  try {
    const { data } = await axios.post(
      `https://api.getAddress.io/autocomplete/${addressInformationForm.value.post_code.toUpperCase()}?api-key=${token}`,
      {
        all: true,
        template: "{formatted_address} -- {country}",
      }
    );

    data?.suggestions?.map((i: any) => suggestions.value.push(i.address));
    addressCombobox.value.$el.querySelector("input").focus();
    addressInformationForm.value.post_code =
      addressInformationForm.value.post_code.toUpperCase();
    addressInformationForm.value.address = null;
  } catch (e) {
    $toast.error(getExceptionMessage(e));
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  await store.storeLead({
    ...personalInformationForm.value,
    ...addressInformationForm.value,
    ...additionalInformationForm.value,
  });
};

const epcLink = computed(() => {
  if (isScotland.value) {
    return "https://www.scottishepcregister.org.uk/CustomerFacingPortal/EPCPostcodeSearch";
  }

  return `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${addressInformationForm.value.post_code}`;
});

watch(
  () => addressInformationForm.value.address,
  (n: any) => {
    if (n) {
      const countryRegex = /--\s*(\w+(?:\s*\w+)*)/;
      const match = n.match(countryRegex);
      isScotland.value = match && match[1].toUpperCase() === "SCOTLAND";
    }
  }
);

onMounted(async () => await store.getExtras());
</script>

<template>
  <VCardText>
    <!-- 👉 Stepper -->
    <AppStepper
      v-model:current-step="currentStep"
      :items="steps"
      :is-active-step-valid="isCurrentStepValid"
    />
  </VCardText>

  <VDivider />

  <VCardText>
    <VWindow v-model="currentStep" class="disable-tab-transition">
      <VWindowItem>
        <VForm
          @submit.prevent="validateAddressInformationForm"
          ref="refAddressForm"
        >
          <VRow>
            <VCol cols="12" v-if="addressInformationForm.post_code">
              <VAlert border="start" color="info" variant="tonal">
                <a :href="epcLink" target="_blank">
                  View EPCs of
                  {{ addressInformationForm.post_code.toUpperCase() }}
                </a>
              </VAlert>
            </VCol>

            <VCol cols="12">
              <VAlert border="start" color="info" variant="tonal">
                <a
                  href="https://www.ncm-pcdb.org.uk/sap/pcdbsearch.jsp?pid=26"
                  target="_blank"
                >
                  Click here to check boiler efficiency
                </a>
              </VAlert>
            </VCol>

            <VCol cols="12">
              <VAlert border="start" color="info" variant="tonal">
                <a
                  href="https://www.gassaferegister.co.uk/gas-safety/gas-safety-certificates-records/building-regulations-certificate/order-replacement-building-regulations-certificate/"
                  target="_blank"
                >
                  Click here to check gas safe register
                </a>
              </VAlert>
            </VCol>

            <VCol cols="12" lg="5">
              <VTextField
                v-model="addressInformationForm.post_code"
                label="Postcode"
                :rules="[requiredValidator]"
                placeholder="Enter postcode to search addresses"
                required
                @keydown.enter.prevent="getSuggestions"
              >
                <!-- AppendInner -->
                <template #append-inner>
                  <VFadeTransition leave-absolute>
                    <VProgressCircular
                      v-if="loading"
                      size="24"
                      color="info"
                      indeterminate
                    />
                  </VFadeTransition>
                </template>

                <!-- Append -->
                <template #append>
                  <VBtn
                    :size="$vuetify.display.smAndDown ? 'small' : 'large'"
                    :class="$vuetify.display.smAndDown ? 'mt-n2' : 'mt-n3'"
                    :icon="$vuetify.display.smAndDown"
                    @click="getSuggestions"
                  >
                    <VIcon icon="mdi-map-search-outline" />
                  </VBtn>
                </template>
              </VTextField>
            </VCol>

            <VCol cols="12" lg="7">
              <VCombobox
                v-model="addressInformationForm.address"
                ref="addressCombobox"
                :items="suggestions"
                :rules="[requiredValidator]"
                label="Address"
                placeholder="Enter postcode to search addresses"
                type="text"
                clearable
                required
              />
            </VCol>

            <VCol cols="12">
              <div
                class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
              >
                <VBtn type="submit">
                  Next
                  <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VWindowItem>
      <VWindowItem>
        <VForm
          @submit.prevent="validatePersonalInformationForm"
          ref="refPersonalForm"
        >
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="personalInformationForm.title"
                :items="titles"
                :rules="[requiredValidator]"
                label="Title"
                placeholder="Select title"
                clearable
                required
              />
            </VCol>

            <VCol cols="12" lg="4">
              <VTextField
                v-model="personalInformationForm.first_name"
                :rules="[requiredValidator]"
                label="First Name"
                placeholder="John"
                clearable
                required
              />
            </VCol>

            <VCol cols="12" lg="4">
              <VTextField
                v-model="personalInformationForm.middle_name"
                label="Middle Name"
                placeholder="-"
                clearable
              />
            </VCol>

            <VCol cols="12" lg="4">
              <VTextField
                v-model="personalInformationForm.last_name"
                :rules="[requiredValidator]"
                label="Last Name"
                placeholder="Doe"
                clearable
                required
              />
            </VCol>

            <VCol cols="12" lg="4">
              <VTextField
                v-model="personalInformationForm.email"
                :rules="[requiredValidator, emailValidator]"
                label="Email"
                placeholder="johndoe@example.com"
                clearable
                required
              />
            </VCol>

            <VCol cols="12" lg="4">
              <VTextField
                v-model="personalInformationForm.phone_no"
                :rules="[requiredValidator, integerValidator]"
                label="Phone"
                placeholder="XXX-XXXXXXX"
                type="number"
                clearable
                required
              />
            </VCol>

            <VCol cols="12" lg="4">
              <AppDateTimePicker
                v-model="personalInformationForm.dob"
                :rules="[requiredValidator]"
                :config="{
                  wrap: true,
                  altInput: false,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }"
                label="Date of Birth"
                placeholder="Select date"
                required
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.surveyor_id"
                :items="store.surveyors"
                :rules="[requiredValidator]"
                label="Surveyor"
                item-title="name"
                item-value="id"
                clearable
                required
                :return-object="false"
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.lead_generator_id"
                :items="store.leadGenerators"
                :rules="[requiredValidator]"
                label="Lead Generator"
                item-title="name"
                item-value="id"
                clearable
                required
                :return-object="false"
              />
            </VCol>

            <VCol cols="12">
              <div
                class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
              >
                <VBtn color="secondary" variant="tonal" @click="currentStep--">
                  <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                  Previous
                </VBtn>

                <VBtn type="submit">
                  Next
                  <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VWindowItem>
      <VWindowItem>
        <VForm
          @submit.prevent="validateAdditionalInformationForm"
          ref="refAdditionalInformationForm"
        >
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="additionalInformationForm.measures"
                :items="store.measures"
                label="Measures"
                placeholder="Select Measures"
                item-title="name"
                item-value="id"
                chips
                multiple
                clearable
                :return-object="false"
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.job_type_id"
                :items="store.jobTypes"
                label="Job Type"
                item-title="name"
                item-value="id"
                clearable
                :return-object="false"
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.fuel_type_id"
                :items="store.fuelTypes"
                label="Fuel Type"
                item-title="name"
                item-value="id"
                clearable
                :return-object="false"
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.lead_source_id"
                :items="store.leadSources"
                label="Lead Source"
                item-title="name"
                item-value="id"
                clearable
                :return-object="false"
              />
            </VCol>

            <VCol cols="12" lg="6">
              <VCombobox
                v-model="additionalInformationForm.benefit_type_id"
                :items="store.benefitTypes"
                label="Benefit Type"
                item-title="name"
                item-value="id"
                clearable
                :return-object="false"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="additionalInformationForm.comments"
                label="Comments"
                placeholder="Some comments..."
                auto-grow
                clearable
                counter
              />
            </VCol>

            <VCol
              v-if="additionalInformationForm.has_second_receipent"
              cols="12"
            >
              <VRow>
                <VCol cols="12" lg="3">
                  <VTextField
                    v-model="
                      additionalInformationForm.second_receipent.first_name
                    "
                    :rules="[
                      additionalInformationForm.has_second_receipent &&
                        requiredValidator,
                    ]"
                    label="First Name"
                    placeholder="John"
                    clearable
                    required
                  />
                </VCol>

                <VCol cols="12" lg="3">
                  <VTextField
                    v-model="
                      additionalInformationForm.second_receipent.middle_name
                    "
                    label="Middle Name"
                    placeholder="-"
                    clearable
                  />
                </VCol>

                <VCol cols="12" lg="3">
                  <VTextField
                    v-model="
                      additionalInformationForm.second_receipent.last_name
                    "
                    :rules="[
                      additionalInformationForm.has_second_receipent &&
                        requiredValidator,
                    ]"
                    label="Last Name"
                    placeholder="Doe"
                    clearable
                    required
                  />
                </VCol>

                <VCol cols="12" lg="3">
                  <AppDateTimePicker
                    v-model="additionalInformationForm.second_receipent.dob"
                    :rules="[
                      additionalInformationForm.has_second_receipent &&
                        requiredValidator,
                    ]"
                    :config="{
                      altInput: true,
                      altFormat: 'F j, Y',
                      dateFormat: 'Y-m-d',
                    }"
                    label="Date of Birth"
                    placeholder="Select date"
                    required
                  >
                  </AppDateTimePicker>
                </VCol>
              </VRow>
            </VCol>

            <VCol cols="12">
              <div class="demo-space-x">
                <VSwitch
                  v-model="additionalInformationForm.has_second_receipent"
                  label="Second Receipent"
                />

                <VSwitch
                  v-model="additionalInformationForm.is_marked_as_job"
                  label="Mark as job"
                />
              </div>
            </VCol>

            <VCol cols="12">
              <div
                class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
              >
                <VBtn color="secondary" variant="tonal" @click="currentStep--">
                  <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                  Previous
                </VBtn>

                <VBtn type="submit">
                  Next
                  <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VWindowItem>
      <VWindowItem>
        <VForm @submit.prevent="handleSubmit" ref="refReviewForm">
          <VRow>
            <VCol>
              <VCardText
                class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row"
              >
                <div class="my-4">
                  <h6 class="text-sm font-weight-medium mb-3">
                    Customer Details:
                  </h6>
                  <p class="mb-1">
                    {{
                      personalInformationForm.first_name +
                      " " +
                      personalInformationForm.last_name
                    }}
                  </p>
                  <p class="mb-1">
                    {{ addressInformationForm.address }}
                  </p>
                  <p class="mb-1">
                    {{ personalInformationForm.phone_no }}
                  </p>
                  <p class="mb-0">
                    {{ personalInformationForm.email }}
                  </p>
                </div>

                <div class="my-4">
                  <h6 class="text-sm font-weight-medium mb-3">
                    Lead Number: ####
                  </h6>

                  <div class="d-flex justify-space-between">
                    <VChip size="x-small" color="primary" text="Raw Lead" />
                    <VChip
                      size="x-small"
                      :color="
                        additionalInformationForm.is_marked_as_job
                          ? 'success'
                          : 'error'
                      "
                      :text="
                        additionalInformationForm.is_marked_as_job
                          ? 'Yes'
                          : 'No'
                      "
                    />
                  </div>

                  <VList>
                    <VListItem>
                      <!-- 👉 Avatar  -->
                      <template #prepend>
                        <VAvatar
                          rounded
                          :size="38"
                          :image="avatar3"
                          class="me-3"
                        />
                      </template>

                      <VListItemTitle class="text-sm font-weight-medium mb-1">
                        {{
                          store.surveyors.find(
                            (i: any) =>
                              i.id === additionalInformationForm.surveyor_id
                          )?.name ?? "Not Selected"
                        }}
                      </VListItemTitle>

                      <VListItemSubtitle
                        class="text-xs text-no-wrap d-flex align-center"
                      >
                        <VIcon start :size="16" icon="mdi-calendar-blank" />
                        <span>{{ moment().format("DD-MM-YYYY") }}</span>
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </div>
              </VCardText>
            </VCol>
            <VCol cols="12">
              <div
                class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
              >
                <VBtn color="secondary" variant="tonal" @click="currentStep--">
                  <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
                  Previous
                </VBtn>

                <VBtn type="submit">
                  Submit
                  <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VWindowItem>
    </VWindow>
  </VCardText>
</template>

<style lang="scss" scoped>
.v-list-item {
  padding-inline: 0 !important;
}
</style>
