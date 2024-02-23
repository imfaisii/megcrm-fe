<script setup lang="ts">
import { useToast } from "@/plugins/toastr";

const recordsDuplicated = ref(null);
const recordsInserted = ref(null);
const $toast: any = useToast();

const handleFileUploadResponse = (object: any) => {
  console.log(`output->object`, object);
  recordsDuplicated.value = object?.alreadyFoundEnteries;
  recordsInserted.value = object?.totalUploadedRows;
  if (recordsInserted.value) {
    $toast.success(
      `File uploaded  ${recordsInserted.value} enteries successfully`
    );
  }
};
</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard class="leads-card">
        <VCardTitle class="pl-4 pr-4 mt-3 mb-2">
          <VRow class="text-layout">
            <VCol
              cols="12"
              lg="6"
              :class="$vuetify.display.lgAndUp ? 'text-left' : 'text-center'"
            >
              <h6 class="text-h5">Upload Leads</h6>
            </VCol>
          </VRow>
        </VCardTitle>

        <VCardText>
          <UploadLeadForm @file-upload-response="handleFileUploadResponse" />
        </VCardText>

        <VCardText v-if="recordsDuplicated">
          <VAlert type="error">
            The Following Leads Found Duplicate to the Software, possibly the
            exact address was resting in the database or the file address
            finally ended up turning into the datbase one
          </VAlert>
          <VTable class="mt-4" fixed-header v-show="true">
            <thead>
              <tr>
                <th class="text-uppercase">Website</th>
                <th class="text-uppercase">Email</th>
                <th class="text-uppercase">Name</th>
                <th class="text-uppercase">Post code</th>
                <th class="text-uppercase">Address</th>
                <th class="text-uppercase">File/Database</th>
              </tr>
            </thead>
            <tbody class="text-high-emphasis">
              <tr v-for="(Record, index) in recordsDuplicated">
                <td>
                  <p class="font-weight-bold">
                    {{ Record?.website }}
                  </p>
                </td>
                <td>
                  <p class="font-weight-medium">
                    {{ Record?.email }}
                  </p>
                </td>
                <td>
                  <p class="font-weight-medium">
                    {{ Record?.name }}
                  </p>
                </td>
                <td>
                  <p class="font-weight-medium">
                    {{ Record?.postcode }}
                  </p>
                </td>
                <td>
                  <p class="text-button font-italic">
                    {{ Record?.address }}
                  </p>
                </td>
                <td>
                  <p class="text-button font-italic">
                    {{
                      Record.hasOwnProperty("isDataBase")
                        ? `Database with id : ${Record.id}`
                        : "File"
                    }}
                  </p>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
