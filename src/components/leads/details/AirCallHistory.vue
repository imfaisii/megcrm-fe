<script setup lang="js">
import useTime from "@/composables/useTime";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import useApiFetch from '@/composables/useApiFetch'
import { useToast } from '@/plugins/toastr'
import {ref} from 'vue';
import {
  requiredValidator,
} from "@validators";


const leadStore = useLeadsStore();
const time = useTime();
const isDialogVisible = ref(false);
const Loader = ref(false);
const toast = useToast();
const errorMessage = ref('');
const AirCallFormRef = ref();
const form= ref({
  'phone_number':null
});
const oldNumberSearched = ref(null);
onMounted(() => {
  form.value.phone_number = leadStore?.selectedLead?.phone_no;
})
const isInputSame = computed(() => form.value.phone_number === oldNumberSearched.value);
const responseData =  ref(null);


const AircallSerach = async () => {
  try{
  const {valid:valid} = await  AirCallFormRef?.value.validate();
    if(!valid)
    return ;
      Loader.value = true;
      ({data:responseData.value} = await useApiFetch("/aircall/search-call",{
        data: form.value,
        method: 'POST',
      }));
      errorMessage.value = '';
      oldNumberSearched.value = form.value.phone_number;
  }catch(err){
    if (err.response.status === 422) {
      errorMessage.value = err?.response?.data?.errors?.phone_number?.[0]
    } else {
      toast.error(err);
    }
  }
  finally{
    Loader.value = false;
  }


};
</script>

<template>
  <VCard title="Call History" class="pa-5">
    <VCardText>
      <VList
        lines="two"
        class="air-call-history-list card-list custom-overflow"
      >
        <template #default>
          <VAlert class="mb-4" border="start" color="info" variant="tonal">
            Enter an
            <v-icon>
              <v-tooltip activator="parent" location="start">
                <span
                  >164 numbers are formatted [+] [country code] [subscriber
                  number including area code] and can have a maximum of fifteen
                  digits</span
                >
              </v-tooltip>
              mdi-information-outline
            </v-icon>
            E.164 Format Number to get the history
          </VAlert>

          <section>
            <VRow>
              <VCol cols="12">
                <VCard class="air-call-search-card">
                  <VRow class="pa-4">
                    <VCol cols="12">
                      <v-form
                        @submit.prevent="AircallSerach"
                        ref="AirCallFormRef"
                      >
                        <VRow>
                          <VCol cols="12" lg="8">
                            <VTextField
                              v-model="form.phone_number"
                              :rules="[requiredValidator]"
                              label="Phone Number"
                              placeholder="+441514960453"
                              :counter="15"
                              clearable
                              required
                              :error-messages="errorMessage"
                            />
                          </VCol>

                          <VCol cols="4" lg="4">
                            <!-- Search button -->
                            <VBtn
                              class="float-right"
                              type="submit"
                              :disabled="
                                Loader || !form.phone_number || isInputSame
                              "
                              :loading="Loader"
                            >
                              Search
                            </VBtn>
                          </VCol>
                        </VRow>
                      </v-form>
                    </VCol>
                  </VRow>
                  <VTable class="mt-4" fixed-header v-show="!Loader">
                    <thead>
                      <tr>
                        <th class="text-uppercase">Caller Name</th>
                        <th class="text-uppercase">Call Start Time</th>
                        <th class="text-uppercase">Call End Time</th>
                        <th class="text-uppercase">duration</th>
                        <th class="text-uppercase">Phone Number</th>
                        <th class="text-uppercase">Direction</th>
                      </tr>
                    </thead>
                    <tbody class="text-high-emphasis">
                      <tr v-if="!responseData">
                        <td
                          class="font-italic font-weight-medium text-center"
                          colspan="6"
                        >
                          No records found.
                        </td>
                      </tr>
                      <tr v-else v-for="(callRecord, index) in responseData">
                        <td>
                          <p class="font-weight-bold">
                            {{ callRecord?.user?.name }}
                          </p>
                        </td>
                        <td>
                          <p class="font-weight-medium">
                            {{
                              time.convertTimeStampToDate(
                                callRecord?.started_at
                              )
                            }}
                          </p>
                        </td>
                        <td>
                          <p class="font-weight-medium">
                            {{
                              time.convertTimeStampToDate(callRecord?.ended_at)
                            }}
                          </p>
                        </td>
                        <td>
                          <p class="font-weight-medium">
                            {{
                              time.convertSecondsToMinutes(
                                callRecord?.duration ?? 0
                              )
                            }}
                            mins
                          </p>
                        </td>
                        <td>
                          <p class="text-button font-italic">
                            {{ callRecord?.number?.digits }}
                          </p>
                        </td>
                        <td>
                          <p class="text-button font-italic">
                            {{ callRecord?.direction }}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </VCard>
              </VCol>
            </VRow>
          </section>
        </template>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5625rem;
}
.custom-overflow {
  overflow: visible !important;
}
.float-right {
  float: right;
}
</style>

<style lang="scss">
.meeting-schedule-list {
  .v-list-item__append {
    block-size: 100%;
  }
}
</style>
