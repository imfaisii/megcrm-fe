import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { EventBus } from '@/utils/useEventBus'
import { handleError, reshapeParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

type UserData = {
  name: string
  email: string
  roles: number[]
  password: string
  password_confirmation: string
  status: string
}

export const useUsersStore = defineStore('users', () => {
  const endPoint = '/users'
  const users = ref<any>([])
  const selectedUser = ref<any>(null)
  const selectedId = ref<any>(null)
  const errors = ref<any>({})
  const isLoading = ref<any>(false)
  const meta = ref<any>(defaultPagination)
  const $toast: any = useToast()


  const isUserSelected = computed(() => !!selectedUser.value)

  const fetchUsers = async (options = {}) => {
    isLoading.value = true
    const { data, meta: serverMeta } = await useApiFetch(reshapeParams(endPoint, meta, options))
    users.value = data.users
    meta.value = serverMeta
    isLoading.value = false
  }

  const fetchUser = async (userId: Number) => {
    isLoading.value = true
    selectedId.value = userId
    const { data } = await useApiFetch(`${endPoint}/${userId}`)
    selectedUser.value = data.user
    isLoading.value = false
    EventBus.$emit('toggle-users-dialog', true)
  }

  const storeUser = async (userData: UserData, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch('/users', {
        data: userData,
        ...options,
      })
      $toast.success('User was saved successfully.')
      errors.value = {}
      EventBus.$emit('toggle-users-dialog', false)
      await fetchUsers()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (userId: number, options = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      selectedId.value = userId
      await useApiFetch(`${endPoint}/${userId}`, options)
      $toast.success('User was deleted successfully.')
      await fetchUsers()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userData: UserData, options: any = { method: 'PUT' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`/users/${selectedId.value}`, {
        data: userData,
        ...options,
      })
      $toast.success('User was updated successfully.')
      errors.value = {}
      EventBus.$emit('toggle-users-dialog', false)
      await fetchUsers()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    selectedId,
    isLoading,
    isUserSelected,
    selectedUser,
    meta,
    errors,

    fetchUsers,
    fetchUser,
    storeUser,
    deleteUser,
    updateUser
  }
})
