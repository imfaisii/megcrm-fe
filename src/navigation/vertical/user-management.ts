import type { VerticalNavItems } from '@/@layouts/types'
import { modules } from '@/constants/modules'

export default [
  {
    heading: 'User Management',
    permissions: [
      modules.USERS + '.*',
    ],
  },
  {
    title: 'Users',
    icon: { icon: 'mdi-account-group-outline' },
    to: 'users',
    permissions: [modules.USERS + '.*'],
  },
  {
    title: 'Roles & Permissions',
    icon: { icon: 'mdi-shield-account-outline' },
    to: 'users-roles',
    permissions: [modules.PERMISSIONS + '.*'],
  },
] as VerticalNavItems
