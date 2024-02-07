import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    heading: 'Events',
    permissions: ['auth.*']
  },
  {
    title: 'Calendar',
    icon: { icon: 'mdi-calendar-outline' },
    to: 'calendar',
    permissions: ['auth.*'],
  },
] as VerticalNavItems
