<script lang="ts" setup>
import { useToast } from "@/plugins/toastr";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { focusFirstErrorDiv, getExceptionMessage } from "@/utils/useHelper";
import {
  emailValidator,
  integerValidator,
  requiredValidator,
} from "@validators";
import axios from "axios";

type Lead = {
  title: String | null;
  first_name: String | null;
  middle_name: String | null;
  last_name: String | null;
  email: String | null;
  phone_no: String | null;
  dob: String | null;
  address: String | null;
  postcode: String | null;
  comments: String | null;
  measures: Number[] | null;
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

const formRef = ref();
const addressCombobox = ref();
const loading = ref(false);
const suggestions: Ref<String[]> = ref([]);
const selectedPostCode = ref(null);

const form = ref<Lead>({
  title: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  email: null,
  phone_no: null,
  dob: null,
  address: null,
  postcode: null,
  comments: null,
  measures: null,
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

const $toast = useToast();

const getSuggestions = async () => {
  const token =
    "dtoken_hEDzcyiWMr3vw9D-ayVYGo18-AyveC0C_wdimZNl_JJ6MTe6C9_XKo1eyhADhPZykrWyUqrMM9cE0H0LewTj8cVahpYHIi8S0c5O4NBUPk9s9Sc-5BDfHJPHxrq0AfRqeAzBRy8C06NoLZw4Srsc65lVXelpIerj0VM-VAeFWhIMNzVYlQ0G6xEN1zBr19d955A4k_6-r-Y";
  loading.value = true;
  suggestions.value = [];

  try {
    const { data } = await axios.post(
      `https://api.getAddress.io/autocomplete/${selectedPostCode.value.toUpperCase()}?api-key=${token}`,
      {
        all: true,
        template: "{formatted_address}{postcode, } -- {postcode}",
      }
    );
    data?.suggestions?.map((i: any) => suggestions.value.push(i.address));
    addressCombobox.value.$el.querySelector("input").focus();
    form.value.postcode = selectedPostCode.value?.toUpperCase();
    selectedPostCode.value = null;
  } catch (e) {
    $toast.error(getExceptionMessage(e));
  } finally {
    loading.value = false;
  }
};

const store = useLeadsStore();
const titles = ["Mr", "Mrs"];

const handleSubmit = async () => {
  const validation = await formRef.value.validate();

  if (validation?.valid) {
    alert("submit");
  } else {
    focusFirstErrorDiv();
  }
};

onMounted(async () => await store.getExtras());
</script>

<template>
  <VForm @submit.prevent="handleSubmit" ref="formRef">
    <VRow>
      <VCol cols="3">
        <VCombobox
          v-model="form.title"
          :items="titles"
          :rules="[requiredValidator]"
          label="Title"
          placeholder="Select title"
          clearable
          required
        />
      </VCol>

      <VCol cols="3">
        <VTextField
          v-model="form.first_name"
          :rules="[requiredValidator]"
          label="First Name"
          placeholder="John"
          clearable
          required
        />
      </VCol>

      <VCol cols="3">
        <VTextField
          v-model="form.middle_name"
          label="Middle Name"
          placeholder="-"
          clearable
        />
      </VCol>

      <VCol cols="3">
        <VTextField
          v-model="form.last_name"
          :rules="[requiredValidator]"
          label="Last Name"
          placeholder="Doe"
          clearable
          required
        />
      </VCol>

      <VCol cols="4">
        <VTextField
          v-model="form.email"
          :rules="[requiredValidator, emailValidator]"
          label="Email"
          placeholder="johndoe@example.com"
          clearable
          required
        />
      </VCol>

      <VCol cols="4">
        <VTextField
          v-model="form.phone_no"
          :rules="[requiredValidator, integerValidator]"
          label="Phone"
          placeholder="XXX-XXXXXXX"
          type="number"
          clearable
          required
        />
      </VCol>

      <VCol cols="4">
        <AppDateTimePicker
          v-model="form.dob"
          :rules="[requiredValidator]"
          :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d' }"
          label="Date of Birth"
          placeholder="Select date"
          required
        />
      </VCol>

      <VCol cols="8">
        <VCombobox
          v-model="form.address"
          ref="addressCombobox"
          :items="suggestions"
          :rules="[requiredValidator]"
          label="Address"
          placeholder="Enter postcode to search addresses"
          type="text"
          clearable
          required
          @keydown.enter.prevent="getSuggestions"
        >
          <!-- Prepend -->
          <template #prepend>
            <VTooltip location="bottom">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-help-circle-outline" />
              </template>
              You can enter a postcode and press the button to search most
              relevant addresses.
            </VTooltip>
          </template>

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
        </VCombobox>
      </VCol>

      <VCol cols="4">
        <VTextField
          v-model="form.postcode"
          label="Postcode"
          placeholder="No address selected"
          readonly
        />
      </VCol>

      <VCol cols="12">
        <VCombobox
          v-model="form.measures"
          :items="store.measures"
          label="Measures"
          placeholder="Select Measures"
          item-title="name"
          item-key="id"
          chips
          multiple
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.job_type_id"
          :items="store.jobTypes"
          label="Job Type"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.fuel_type_id"
          :items="store.fuelTypes"
          label="Fuel Type"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.surveyor_id"
          :items="store.surveyors"
          label="Surveyor"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.lead_generator_id"
          :items="store.leadGenerators"
          label="Lead Generator"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.lead_source_id"
          :items="store.leadSources"
          label="Lead Source"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="6">
        <VCombobox
          v-model="form.benefit_type_id"
          :items="store.benefitTypes"
          label="Benefit Type"
          item-title="name"
          item-key="id"
          clearable
        />
      </VCol>

      <VCol cols="12">
        <VTextarea
          v-model="form.comments"
          label="Comments"
          placeholder="Some comments..."
          auto-grow
          clearable
          counter
        />
      </VCol>

      <VCol v-if="form.has_second_receipent" cols="12">
        <VRow>
          <VCol cols="3">
            <VTextField
              v-model="form.second_receipent.first_name"
              :rules="[form.has_second_receipent && requiredValidator]"
              label="First Name"
              placeholder="John"
              clearable
              required
            />
          </VCol>

          <VCol cols="3">
            <VTextField
              v-model="form.second_receipent.middle_name"
              label="Middle Name"
              placeholder="-"
              clearable
            />
          </VCol>

          <VCol cols="3">
            <VTextField
              v-model="form.second_receipent.last_name"
              :rules="[form.has_second_receipent && requiredValidator]"
              label="Last Name"
              placeholder="Doe"
              clearable
              required
            />
          </VCol>

          <VCol cols="3">
            <AppDateTimePicker
              v-model="form.second_receipent.dob"
              :rules="[form.has_second_receipent && requiredValidator]"
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
            v-model="form.has_second_receipent"
            label="Second Receipent"
          />

          <VSwitch v-model="form.is_marked_as_job" label="Mark as job" />
        </div>
      </VCol>
    </VRow>

    <!-- Actions button -->
    <div class="d-flex align-center justify-center gap-3 mt-6">
      <VBtn
        type="submit"
        :disabled="store.isLoading"
        :loading="store.isLoading"
      >
        Create Lead
      </VBtn>

      <slot name="dialogCloseButton" />
    </div>
  </VForm>
</template>
