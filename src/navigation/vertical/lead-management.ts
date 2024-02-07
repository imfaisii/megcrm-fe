import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'Lead Management' },
  {
    title: 'Leads',
    icon: { icon: 'mdi-check-outline' },
    children: [
      { title: 'Leads Statuses', to: 'leads-statuses' },
      { title: 'Create Lead', to: 'leads-create' },
      { title: 'List Leads', to: 'leads' },
      { title: 'Assignments', to: 'leads-assignments' },
    ]
  },
] as VerticalNavItems
