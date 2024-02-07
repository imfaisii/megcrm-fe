import type { VerticalNavItems } from '@/@layouts/types'
import { modules } from '@/constants/modules'

const globalPermissions = [
  modules.LEADS + '.*',
  modules.LEAD_STATUSES + '.*',
  modules.LEAD_GENERATOR_ASSIGNMENTS + '.*',
]

export default [
  {
    heading: 'Lead Management',
    permissions: globalPermissions
  },
  {
    title: 'Leads',
    icon: { icon: 'mdi-star-check-outline' },
    permissions: globalPermissions,
    children: [
      {
        title: 'Leads Statuses', to: 'leads-statuses',
        permissions: [modules.LEAD_STATUSES + '.*'],
      },
      {
        title: 'Create Lead', to: 'leads-create',
        permissions: [modules.LEADS + '.create'],
      },
      {
        title: 'List Leads', to: 'leads',
        permissions: [modules.LEADS + '.index'],
      },
      {
        title: 'Assignments', to: 'leads-assignments',
        permissions: [modules.LEAD_GENERATOR_ASSIGNMENTS + '.*'],
      },
    ]
  },
] as VerticalNavItems
