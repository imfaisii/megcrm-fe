import useApiFetch from '@/composables/useApiFetch'
import { useToast } from '@/plugins/toastr'
import { getExceptionMessage, reshapeParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

type RoleData = {
  name: string
  permissions: number[]
}

export const usePermissionsStore = defineStore('permissions', () => {
  const rolesEndpoint = '/roles'
  const permissionsEndpoint = '/permissions'
  const roles = ref([])
  const permissions = ref([])
  const selectedRole = ref<any>({
    permissions: []
  })
  const isLoading = ref(false)
  const $toast: any = useToast()

  const isRoleSelected = computed(() => !!selectedRole.value)

  const getPermissions = async (options: any = { all: 'true' }) => {
    isLoading.value = true
    const { data } = await useApiFetch(reshapeParams(permissionsEndpoint, null, options))
    permissions.value = data.permissions
    isLoading.value = false
  }

  const getRoles = async (options: any = { all: 'true' }) => {
    isLoading.value = true
    const { data } = await useApiFetch(reshapeParams(rolesEndpoint, null, options))
    roles.value = data.roles

    roles.value.forEach((role: any) => {
      role.meta = getCountTotalPermissionsCountFromRole(role.name)
    })

    isLoading.value = false
  }

  const storeRole = async (roleData: RoleData, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch('/roles', {
        data: roleData,
        ...options,
      })
      await getRoles({ include: "permissions" })
      $toast.success('Role was saved successfully.')
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  const updateRole = async (roleData: RoleData, options: any = { method: 'PUT' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`/roles/${selectedRole.value.id}`, {
        data: roleData,
        ...options,
      })
      await getRoles({ include: "permissions" })
      $toast.success('Role was updated successfully.')
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  const deleteRole = async (roleId: number, options: any = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`/roles/${roleId}`, options)
      $toast.success('Role was deleted successfully.')
      await getRoles({ include: "permissions" })
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  const getCountTotalPermissionsCountFromRole = (roleName: string) => {
    const role: any = roles.value.find((role: any) => role.name === roleName)

    if (!role) {
      return {
        totalPermissions: 0,
        moduleCount: 0,
      }
    }

    const moduleCount = role.formatted_permissions.length
    let submoduleCount = 0

    for (const module of role.formatted_permissions) {
      submoduleCount += module.submodules.length
    }

    return {
      totalPermissions: submoduleCount,
      moduleCount: moduleCount,
    }
  }

  return {
    roles,
    permissions,
    isLoading,
    selectedRole,
    isRoleSelected,
    storeRole,
    updateRole,
    deleteRole,
    getRoles,
    getPermissions,
  }
})
