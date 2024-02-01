import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'Lead Management' },
  {
    title: 'Leads',
    icon: { icon: 'mdi-check-outline' },
    children: [
      { title: 'Create Lead', to: 'leads-create' },
      { title: 'List Leads', to: 'leads' },
      { title: 'Leads Statuses', to: 'leads-statuses' },
    ]
  },
] as VerticalNavItems
