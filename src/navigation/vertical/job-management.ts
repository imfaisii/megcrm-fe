import type { VerticalNavItems } from '@/@layouts/types'
import { modules } from '@/constants/modules'

const globalPermissions = [
  modules.LEAD_JOBS + '.*',
]

export default [
  {
    heading: 'Job Management',
    permissions: globalPermissions
  },
  {
    title: 'Jobs',
    icon: { icon: 'mdi-stairs-up' },
    permissions: globalPermissions,
    children: [
      {
        title: 'All Jobs', to: 'jobs',
        permissions: [modules.LEAD_JOBS + '.index'],
      },
    ]
  },
] as VerticalNavItems
