import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { EventBus } from '@/utils/useEventBus'
import { handleError, renameFile, reshapeParams } from '@/utils/useHelper'
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
  const GENDERS = ['Male', 'Female']

  const defaultModel = {
    id: null,
    name: null,
    email: null,
    current_password: null,
    password: null,
    password_confirmation: null,
    is_active: true,
    roles: [],
    aircall_email_address: null,
    documents: [],
    additional: {
      dob: null,
      gender: GENDERS[0],
      address: null,
      phone_no: null,
      bank: null,
      account_number: null,
      nin: null,
      visa_expiry: null
    },
    installer_company: {
      name: null,
      address: null,
      company_number: null,
      vat_number: null,
    }
  }
  const endPoint = '/users'
  const entity = 'User'
  const users = ref<any>([])
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
    users.value = data.users
    meta.value = {
      filters: meta.value?.filters ?? {},
      ...serverMeta
    }
    isLoading.value = false
  }

  const get = async (userId: Number) => {
    isLoading.value = true
    selectedId.value = userId
    const { data } = await useApiFetch(`${endPoint}/${userId}?include=additional.bank,installerCompany`)
    selected.value = data.user
    selected.value.roles = data.user.roles.map((i: any) => i.id)

    if (selected.value.additional === null) {
      selected.value.additional = defaultModel.additional
    }

    if (selected.value.installer_company === null) {
      selected.value.installer_company = defaultModel.installer_company
    }

    selected.value.additional.bank = selected.value?.additional?.bank?.name ?? null;
    isLoading.value = false
    EventBus.$emit('toggle-users-dialog', true)
  }

  const store = async (userData: UserData, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      const { data } = await useApiFetch('/users', {
        data: userData,
        ...options,
      })
      $toast.success('User was saved successfully.')
      errors.value = {}
      await get(data.user.id)
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
      await useApiFetch(`${endPoint}/${id}`, options)
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
      await useApiFetch(`${endPoint}/${id}`, {
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
      await useApiFetch(`${endPoint}/${id}/profile`, {
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

  const uploadFile = async (userId: number, file: File, fileName: string | null, options = { method: 'POST' }) => {
    try {
      if (fileName) {
        file = renameFile(file, fileName)
      }

      let formData = new FormData()
      formData.set('file', file)

      await useApiFetch(`${endPoint}/${userId}/documents/upload`, {
        data: formData,
        ...options
      })

      $toast.success(`File was uploaded successfully.`)
    } catch (error) {
      handleError(error, errors)
    }
  }

  const saveDocumentToCollection = async (collection: string, file: File, fileName: string | null, expiry: string | null, options = { method: 'POST' }) => {
    try {
      if (fileName) {
        file = renameFile(file, fileName)
      }

      let formData = new FormData()

      formData.set('file', file)
      formData.set('collection', collection)

      if (expiry) {
        formData.set('expiry', expiry)
      }

      await useApiFetch(`${endPoint}/collections/docs/upload`, {
        data: formData,
        ...options
      })

      $toast.success(`File was uploaded successfully.`)
    } catch (error) {
      handleError(error, errors)
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
    GENDERS,

    defaultModel,
    users,
    selectedId,
    isLoading,
    isSelected,
    selected,
    meta,
    errors,
    includes,

    saveDocumentToCollection,
    uploadFile,
    resolveUserStatusVariant,
    resolveUserRoleVariant,
    reset,
    index,
    get,
    store,
    destroy,
    update,
    updateProfile
  }
})
