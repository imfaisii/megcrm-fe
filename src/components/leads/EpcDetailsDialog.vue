<script lang="ts" setup>
const props = defineProps({
  details: {
    reqiured: true,
    type: Object,
  },
  isDialogVisible: {
    type: Boolean,
    default: () => false,
  },
});

const panel = ref(0);
const emit = defineEmits(["onDialogClose"]);
const closeDialog = () => emit("onDialogClose");

const keyValues: any = computed(() => {
  const keyValuePairs: any = {};
  for (const key in props.details) {
    if (!Array.isArray(props.details[key])) {
      keyValuePairs[key] = props.details[key];
    }
  }
  return keyValuePairs;
}) as any;

const arrays = computed(() => {
  const arrayValues: any = {};
  for (const key in props.details) {
    if (Array.isArray(props.details[key])) {
      arrayValues[key] = props.details[key];
    }
  }
  return arrayValues;
});

const getTitle = (arr: any) => {
  return Array.isArray(arr) ? arr.length : "";
};

const isArrayOfTypeString = (arr: any) => {
  return arr.every((item: any) => typeof item === "string");
};

const getObjectKeys = (arr: any) => {
  if (arr.length > 0 && typeof arr[0] === "object") {
    return Object.keys(arr[0]);
  } else {
    return [];
  }
};
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 1100"
    :model-value="isDialogVisible"
    @update:model-value="closeDialog"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeDialog" />

    <VCard class="pa-sm-8 pa-5">
      <!-- Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-3">EPC Details </VCardTitle>
      </VCardItem>

      <VCardText>
        <div v-for="(v, k) in keyValues" class="d-flex justify-space-between">
          <p class="text-uppercase">
            <strong>
              <!-- @vue-skip-->
              {{
                k
                  .replaceAll("_", " ")
                  .replaceAll("I D", "ID")
                  .replaceAll("STEPS", "STEPS ")
                  .replaceAll("STEP", "STEP ")
                  .replaceAll("TO", " TO ")
                  .replaceAll("AND", " AND ")
              }}
            </strong>
          </p>
          <p class="text-uppercase font-italic">{{ v }}</p>
        </div>

        <VExpansionPanels v-model="panel">
          <VExpansionPanel v-for="(v, k) in arrays" :key="k">
            <VExpansionPanelTitle disable-icon-rotate>
              <!--@vue-skip-->
              <strong>{{ k.toUpperCase() }}</strong>
              <template #actions>
                <VBtn
                  rounded
                  :title="getTitle(v)"
                  color="warning"
                  size="x-small"
                >
                  <strong>{{ getTitle(v) }}</strong>
                </VBtn>
              </template>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <template v-if="isArrayOfTypeString(v)">
                <VList>
                  <VListItem v-for="(item, index) in v" :key="index">
                    {{ item }}
                  </VListItem>
                </VList>
              </template>
              <template v-else>
                <VTable fixed-header>
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase"
                        v-for="(key, index) in getObjectKeys(v)"
                        :key="index"
                      >
                        {{ key }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-high-emphasis">
                    <tr v-for="(obj, index) in v" :key="index">
                      <td class="py-4" v-for="(value, key) in obj" :key="key">
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </template>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
:deep(.v-expansion-panel-title) {
  background: lemonchiffon;
}
</style>
