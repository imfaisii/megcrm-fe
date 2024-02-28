import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { EventBus } from '@/utils/useEventBus'
import { handleError, reshapeParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

type UserData = {
  name: string
}

export const defaultModel = {
  id: null,
  name: null,
}

export const useTeamStore = defineStore('team', () => {
  const endPoint = '/team'
  const entity = 'Team'
  const teamLeader = ref<any>([]);
  const team = ref<any>([])
  const selected = ref<any>(defaultModel)
  const selectedId = ref<any>(null)
  const errors = ref<any>({})
  const isLoading = ref<any>(false)
  const meta = ref<any>(defaultPagination)
  const $toast: any = useToast()
  const includes = ["createdBy"]

  const isSelected = computed(() => !!selected.value.id)

  const index = async (options = {}) => {
    isLoading.value = true
    const { data, meta: serverMeta } = await useApiFetch(reshapeParams(endPoint, meta.value, options))
    team.value = data.users
    meta.value = {
      filters: meta.value?.filters ?? {},
      ...serverMeta
    }
    isLoading.value = false
  }

  const get = async (userId: Number) => {
    isLoading.value = true
    selectedId.value = userId
    const { data } = await useApiFetch(`${endPoint}/${userId}`)
    selected.value = data.user
    selected.value.roles = data.user.roles.map((i: any) => i.id)
    isLoading.value = false
    EventBus.$emit('toggle-users-dialog', true)
  }

  const setTeamLeads = async () => {
    try {
      isLoading.value = true

      /* this will set get all the team leader from the backend in the case of edit and all surveyors in the case of add */
      if (selectedId) {
        // its an edit case so get all the team leader
        // const response = await 

      }
      else {
        // this will return all the users with surverys roles
        const response = await useApiFetch(reshapeParams("users", {}, {
          all: true,
          filters: {
            roles: [3]
          }
        }));
      }

    } catch (err) {
      console.log(`output - err`, err)
    } finally {
      isLoading.value = false
    }

  }
  const store = async (userData: UserData, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch('/users', {
        data: userData,
        ...options,
      })
      $toast.success('User was saved successfully.')
      errors.value = {}
      EventBus.$emit('toggle-users-dialog', false)
      await index()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const destroy = async (id: number, options = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      selectedId.value = id
      await useApiFetch(`${endPoint} / ${id}`, options)
      $toast.success(`${entity} was deleted successfully.`)
      await index()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const update = async (id: number | string, payload: any, options = { method: 'PUT' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`${endPoint} / ${id}`, {
        data: payload,
        ...options
      })
      $toast.success(`${entity} was updated successfully.`)
      errors.value = {}
      EventBus.$emit('toggle-users-dialog', false)
      await index()
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (id: number | string, payload: any, options = { method: 'PUT' }) => {
    try {
      errors.value = {}
      isLoading.value = true
      await useApiFetch(`${endPoint} / ${id} / profile`, {
        data: payload,
        ...options
      })
      $toast.success(`Profile was updated successfully.`)
      errors.value = {}
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    selected.value = { ...defaultModel }
    errors.value = {}
  }

  const resolveUserRoleVariant = (role: string) => {
    const roleLowerCase = role.toLowerCase();

    if (roleLowerCase === "super admin")
      return { color: "warning", icon: "tabler-device-laptop" };

    return { color: "primary", icon: "tabler-user" };
  };

  const resolveUserStatusVariant = (stat: string) => {
    if (stat) {
      return "success";
    }

    return "error";
  };


  return {
    team,
    selectedId,
    isLoading,
    isSelected,
    selected,
    meta,
    errors,
    includes,
    teamLeader,

    resolveUserStatusVariant,
    resolveUserRoleVariant,
    reset,
    index,
    get,
    store,
    destroy,
    update,
    updateProfile,
    setTeamLeads,
  }
})
