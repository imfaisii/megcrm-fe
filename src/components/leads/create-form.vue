<script lang="ts" setup>
import { useToast } from '@/plugins/toastr';
import { useLeadsStore } from '@/stores/leads/useLeadsStore';
import { getExceptionMessage } from '@/utils/useHelper';
import {
  emailValidator,
  integerValidator,
  requiredValidator
} from '@validators';
import axios from 'axios';

const formRef = ref()
const addressCombobox = ref()
const loading = ref(false)
const suggestions: Ref<String[]> = ref([])
const postcode = ref(null)

const form = ref({
  title: null,
  name: '',
  date: ''
})

const $toast = useToast()

const getSuggestions = async () => {
  const token = 'dtoken_hEDzcyiWMr3vw9D-ayVYGo18-AyveC0C_wdimZNl_JJ6MTe6C9_XKo1eyhADhPZykrWyUqrMM9cE0H0LewTj8cVahpYHIi8S0c5O4NBUPk9s9Sc-5BDfHJPHxrq0AfRqeAzBRy8C06NoLZw4Srsc65lVXelpIerj0VM-VAeFWhIMNzVYlQ0G6xEN1zBr19d955A4k_6-r-Y'
  loading.value = true
  suggestions.value = []

  try {
    const { data } = await axios.post(`https://api.getAddress.io/autocomplete/${postcode.value.toUpperCase()}?api-key=${token}`, {
      all: true
    })
    data?.suggestions?.map((i: any) => suggestions.value.push(i.address))
    addressCombobox.value.$el.querySelector("input").focus()
    postcode.value = null
  } catch (e) {
    $toast.error(getExceptionMessage(e))
  } finally {
    loading.value = false
  }

}

const store = useLeadsStore()
const titles = ['Mr', 'Mrs']

const handleSubmit = async () => {
  const validation = await formRef.value.validate()

  if (validation?.valid) {
    alert("submit")
  }
}

onMounted(async () => await store.getExtras())
</script>

<template>
  <VForm @submit.prevent="handleSubmit" ref="formRef">
    <VRow>
      <VCol cols="3">
        <VCombobox v-model="form.title" :items="titles" placeholder="Select Item" clearable>
          <template #label>
            Title <span :style="{ color: 'red' }">*</span>
          </template>
        </VCombobox>
      </VCol>

      <VCol cols="3">
        <VTextField autofocus placeholder="John" clearable :rules="[requiredValidator]">
          <template #label>
            First Name <span :style="{ color: 'red' }">*</span>
          </template>
        </VTextField>
      </VCol>

      <VCol cols="3">
        <VTextField autofocus clearable label="Middle Name" placeholder="-" />
      </VCol>

      <VCol cols="3">
        <VTextField autofocus clearable label="Last Name" placeholder="Doe" :rules="[requiredValidator]">
          <template #label>
            Last Name <span :style="{ color: 'red' }">*</span>
          </template>
        </VTextField>
      </VCol>

      <VCol cols="4">
        <VTextField autofocus clearable label="Email" placeholder="johndoe@example.com"
          :rules="[requiredValidator, emailValidator]">
          <template #label>
            Email <span :style="{ color: 'red' }">*</span>
          </template>
        </VTextField>
      </VCol>

      <VCol cols="4">
        <VTextField type="number" autofocus clearable label="Phone" placeholder="XXX-XXXXXXX"
          :rules="[requiredValidator, integerValidator]">
          <template #label>
            Phone No. <span :style="{ color: 'red' }">*</span>
          </template>
        </VTextField>
      </VCol>

      <VCol cols="4">
        <AppDateTimePicker v-model="form.date" label="Date of Birth" placeholder="Select date"
          :rules="[requiredValidator]" :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d' }" />
      </VCol>

      <VCol cols="12">
        <VCombobox v-model="postcode" ref="addressCombobox" :items="suggestions" clearable label="Address/Postcode"
          placeholder="AB01 0CD" type="text">
          <!-- Prepend -->
          <template #prepend>
            <VTooltip location="bottom">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-help-circle-outline" />
              </template>
              You can enter a postcode and press the button to search most relevant addresses.
            </VTooltip>
          </template>

          <!-- AppendInner -->
          <template #append-inner>
            <VFadeTransition leave-absolute>
              <VProgressCircular v-if="loading" size="24" color="info" indeterminate />
            </VFadeTransition>
          </template>

          <!-- Append -->
          <template #append>
            <VBtn :size="$vuetify.display.smAndDown ? 'small' : 'large'"
              :class="$vuetify.display.smAndDown ? 'mt-n2' : 'mt-n3'" :icon="$vuetify.display.smAndDown"
              @click="getSuggestions">
              <VIcon icon="mdi-target" />
              <span v-if="$vuetify.display.mdAndUp" class="ms-3">Search addresses</span>
            </VBtn>
          </template>
        </VCombobox>
      </VCol>
    </VRow>

    <!-- Actions button -->
    <div class="d-flex align-center justify-center gap-3 mt-6">
      <VBtn type="submit" :disabled="store.isLoading" :loading="store.isLoading">
        Create Lead
      </VBtn>

      <VBtn color="secondary" variant="tonal" @click="closeDialog">
        Cancel
      </VBtn>
    </div>
  </VForm>
</template>
