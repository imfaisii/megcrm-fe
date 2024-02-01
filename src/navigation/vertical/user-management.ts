import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'User Management' },
  {
    title: 'Users',
    icon: { icon: 'mdi-account-group-outline' },
    to: 'users',
  },
  {
    title: 'Roles & Permissions',
    icon: { icon: 'mdi-shield-account-outline' },
    to: 'users-roles'
  },
] as VerticalNavItems
