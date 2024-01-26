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
    children: [
      { title: 'Roles', to: 'users-roles' },
      { title: 'Permissions', to: 'users-permissions' },
    ],
  },
] as VerticalNavItems
