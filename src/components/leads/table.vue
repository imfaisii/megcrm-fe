<script lang="ts" setup>
import { useLeadsStore } from '@/stores/leads/useLeadsStore';
import { paginationMeta } from '@/utils/usePaginationMeta';
import { VDataTableServer } from 'vuetify/labs/VDataTable';

const store: any = useLeadsStore()

// Headers
const headers = [
  { title: 'Email', key: 'email', searchable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const resolveLeadRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase()

  if (roleLowerCase === 'super admin') return { color: 'warning', icon: 'tabler-device-laptop' }

  return { color: 'primary', icon: 'tabler-user' }
}

const resolveLeadStatusVariant = (stat: string) => {
  if (stat) {
    return 'success'
  }

  return 'error'
}

onMounted(async () => await store.fetchLeads())
</script>


<template>
  <VDataTableServer v-model:items-per-page="store.meta.per_page" v-model:page="store.meta.current_page"
    :items="store.leads" :items-length="10" :headers="headers" @update:sortBy="store.meta.sort = $event"
    class="text-no-wrap" show-select>
    <template #top>
      <VProgressLinear v-if="store.isLoading" indeterminate color="primary" :height="2">
      </VProgressLinear>
    </template>

    <!-- Email -->
    <template #item.email="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column">
          <span class="text-sm text-medium-emphasis">{{ item.raw.email }}</span>
        </div>
      </div>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <!-- <IconBtn>
        <VIcon icon="tabler-edit" />
      </IconBtn> -->
      <IconBtn v-if="item.raw.id !== 1" @click="store.deleteLead(item.raw.id)">
        <VIcon color="error" icon="tabler-trash" />
      </IconBtn>
    </template>

    <!-- pagination -->
    <template #bottom>
      <VDivider />
      <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
        <p class="text-sm text-disabled mb-0">
          {{ paginationMeta(store.meta, store.meta.total) }}
        </p>

        <v-pagination v-model="store.meta.current_page" :length="store.meta.last_page" :total-visible="6">
          <template #prev="slotProps">
            <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
              Previous
            </VBtn>
          </template>
          <template #next="slotProps">
            <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
              Next
            </VBtn>
          </template>
        </v-pagination>
      </div>
    </template>
  </VDataTableServer>
</template>
