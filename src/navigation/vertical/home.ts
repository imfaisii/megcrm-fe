import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    heading: 'Dashboard',
    permissions: ['auth.*']
  },
  {
    title: 'Home',
    to: { name: 'dashboard' },
    icon: { icon: 'mdi-home-outline' },
    badgeContent: '1',
    badgeClass: 'bg-primary',
    permissions: ['auth.*']
  },
] as VerticalNavItems
