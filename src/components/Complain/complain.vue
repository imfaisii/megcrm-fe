<script setup lang="ts">
import useApiFetch from "@/composables/useApiFetch";
import useTime from "@/composables/useTime";
import { useToast } from "@/plugins/toastr";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import { requiredValidator } from "@validators";
import { ref } from "vue";
const leadStore = useLeadsStore();
const time = useTime();
const loader = ref(false);
const toast = useToast();
// const store = useComplainStore();
const props  = defineProps({
  objectId: {
    type: String,
    required: true
  },
})
onMounted(() => {
  store.selectedComplain = props.objectId;
});
</script>
<template>

</template>
