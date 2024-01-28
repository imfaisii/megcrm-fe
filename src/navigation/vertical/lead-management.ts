import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'Lead Management' },
  {
    title: 'Leads',
    icon: { icon: 'mdi-check-outline' },
    children: [
      { title: 'List Leads', to: 'leads' },
      { title: 'Create Lead', to: 'leads-create' },

    ]
  },
] as VerticalNavItems
