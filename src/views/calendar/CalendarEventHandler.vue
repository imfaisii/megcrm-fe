<script setup lang="ts">
import type { Options } from "flatpickr";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { VForm } from "vuetify/components/VForm";

import type { Event, NewEvent } from "./types";
import { useCalendarStore } from "./useCalendarStore";

import { requiredValidator } from "@validators";

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:isDrawerOpen", val: boolean): void;
  (e: "addEvent", val: NewEvent): void;
  (e: "updateEvent", val: Event): void;
  (e: "removeEvent", eventId: string): void;
}>();

interface Props {
  isDrawerOpen: boolean;
  event: Event | NewEvent;
}

// 👉 store
const store = useCalendarStore();
const refForm = ref<VForm>();

// 👉 Event
const event = ref<Event | NewEvent>(JSON.parse(JSON.stringify(props.event)));

const resetEvent = () => {
  event.value = JSON.parse(JSON.stringify(props.event));
  nextTick(() => {
    refForm.value?.resetValidation();
  });
};

watch(() => props.isDrawerOpen, resetEvent);

const removeEvent = () => {
  emit("removeEvent", event.value.id);

  // Close drawer
  emit("update:isDrawerOpen", false);
};

const handleSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // If id exist on id => Update event
      if ("id" in event.value) emit("updateEvent", event.value);
      // Else => add new event
      else emit("addEvent", event.value);

      // Close drawer
      emit("update:isDrawerOpen", false);
    }
  });
};

// 👉 Form

const onCancel = () => {
  emit("update:isDrawerOpen", false);

  nextTick(() => {
    refForm.value?.reset();
    resetEvent();
    refForm.value?.resetValidation();
  });
};

const startDateTimePickerConfig = computed(() => {
  const config: Options = {
    enableTime: !event.value.all_day,
    dateFormat: `Y-m-d${event.value.all_day ? "" : " H:i"}`,
  };

  if (event.value.end_date) config.maxDate = event.value.end_date;

  return config;
});

const endDateTimePickerConfig = computed(() => {
  const config: Options = {
    enableTime: !event.value.all_day,
    dateFormat: `Y-m-d${event.value.all_day ? "" : " H:i"}`,
  };

  if (event.value.start_date) config.minDate = event.value.start_date;

  return config;
});
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="420"
    class="scrollable-content"
    @update:model-value="(val) => $emit('update:isDrawerOpen', val)"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="event.id ? 'Update Event' : 'Add Event'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn v-show="event.id" @click="removeEvent">
          <VIcon size="18" icon="mdi-trash-can-outline" />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- 👉 Title -->
              <VCol cols="12">
                <VTextField
                  v-model="event.title"
                  label="Title"
                  placeholder="Meeting with Jane"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Calendar -->
              <VCol cols="12">
                <VSelect
                  v-model="event.extendedProps.calendar"
                  label="Calendar"
                  placeholder="Select Event Type"
                  :rules="[requiredValidator]"
                  :items="store.availableCalendars"
                  :item-title="(item) => item.name"
                  :item-value="(item) => item.id"
                >
                  <template #selection="{ item }">
                    <div
                      v-show="event.extendedProps.calendar"
                      class="align-center"
                      :class="event.extendedProps.calendar ? 'd-flex' : ''"
                    >
                      <VBadge
                        :color="item.raw.color"
                        inline
                        dot
                        class="pa-1 mb-1"
                      />
                      <span>{{ item.raw.name }}</span>
                    </div>
                  </template>
                </VSelect>
              </VCol>

              <!-- 👉 Start date -->
              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(startDateTimePickerConfig)"
                  v-model="event.start"
                  :rules="[requiredValidator]"
                  label="Start date"
                  placeholder="Select Date"
                  :config="startDateTimePickerConfig"
                />
              </VCol>

              <!-- 👉 End date -->
              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(endDateTimePickerConfig)"
                  v-model="event.end"
                  :rules="[requiredValidator]"
                  label="End date"
                  placeholder="Select End Date"
                  :config="endDateTimePickerConfig"
                />
              </VCol>

              <!-- 👉 All day -->
              <VCol cols="12">
                <VSwitch v-model="event.allDay" label="All day" />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <VTextarea
                  v-model="event.extendedProps.description"
                  label="Description"
                  placeholder="Meeting description"
                />
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Submit </VBtn>
                <VBtn variant="outlined" color="secondary" @click="onCancel">
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
