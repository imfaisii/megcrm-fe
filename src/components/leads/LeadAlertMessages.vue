<script lang="ts" setup>
import { useLeadsStore } from "@/stores/leads/useLeadsStore";

const store = useLeadsStore();
const props = defineProps({
  postCode: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    default: () => "",
  },
});

const epcLink = computed(() => {
  if (store.checkIfCountryIsScotland(props.address)) {
    return "https://www.scottishepcregister.org.uk/CustomerFacingPortal/EPCPostcodeSearch";
  }

  return `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${props.postCode}`;
});
</script>

<template>
  <VCol cols="12" lg="4">
    <VAlert border="start" color="info" variant="tonal">
      <a :href="epcLink" target="_blank">
        View EPCs of
        {{ postCode.toUpperCase() }}
      </a>
    </VAlert>
  </VCol>

  <VCol cols="12" lg="4">
    <VAlert border="start" color="info" variant="tonal">
      <a href="/boilers" target="_blank">
        Click here to check boiler efficiency
      </a>
    </VAlert>
  </VCol>

  <VCol cols="12" lg="4">
    <VAlert border="start" color="info" variant="tonal">
      <a
        href="https://www.gassaferegister.co.uk/gas-safety/gas-safety-certificates-records/building-regulations-certificate/order-replacement-building-regulations-certificate/"
        target="_blank"
      >
        Click here to check gas safe register
      </a>
    </VAlert>
  </VCol>
</template>
