import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { EventBus } from '@/utils/useEventBus'
import { handleError, reshapeParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

export type Surveyor = {
  id: string | null | number
  name: string | null
}

export const useSurveyorsStore = defineStore('surveyors', () => {
  const defaultModel = {
    id: null,
    name: null
  }

  const endPoint = '/users'
  const entity = 'Surveyor'
  const selected = ref<Surveyor>(defaultModel)
  const selectedUser = ref<any>(null)
  const selectedId = ref<any>(null)
  const isLoading = ref(false)
  const errors = ref({})
  const meta = ref(defaultPagination)
  const entries = ref([])
  const $toast: any = useToast()

  const isSelected = computed(() => !!selected.value.id)

  const fetchAll = async (options = {}) => {
    isLoading.value = true
    const { data, meta: serverMeta } = await useApiFetch(reshapeParams(endPoint, meta.value, options))
    entries.value = data.users
    meta.value = serverMeta
    isLoading.value = false
  }

  const fetch = async (userId: Number) => {
    isLoading.value = true
    selectedId.value = userId
    const { data } = await useApiFetch(`${endPoint}/${userId}`)
    selectedUser.value = data.user
    isLoading.value = false
    EventBus.$emit('toggle-users-dialog', true)
  }

  const store = async (payload: any, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch(endPoint, {
        data: payload,
        ...options,
      })
      EventBus.$emit('reset-name-only-dialog')
      $toast.success(`${entity} was saved successfully.`)
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const update = async (id: number | string, payload: any, options = { method: 'PUT' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`${endPoint}/${id}`, {
        data: payload,
        ...options
      })
      $toast.success(`${entity} was updated successfully.`)
      EventBus.$emit('reset-name-only-dialog')
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const destroy = async (id: number, options = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      selected.value.id = id
      await useApiFetch(`${endPoint}/${id}`, options)
      $toast.success(`${entity} was deleted successfully.`)
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
      selected.value.id = null
    }
  }

  const resetState = () => {
    selected.value = defaultModel
  }

  return {
    entries,
    isLoading,
    isSelected,
    selected,
    meta,
    errors,

    resetState,
    fetchAll,
    fetch,
    destroy,
    update,
    store,
  }
})
