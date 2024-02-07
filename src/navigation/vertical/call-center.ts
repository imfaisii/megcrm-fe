import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'Call Center' },
  {
    title: 'Calls',
    to: { name: 'dashboard' },
    icon: { icon: 'mdi-headset' },
    badgeContent: '1',
    badgeClass: 'bg-primary',
  },
] as VerticalNavItems
