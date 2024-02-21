import { VerticalNavItems } from '@/@layouts/types'
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
        permissions: [modules.LEAD_JOBS + '.index', modules.LEADS + '.assigned-leads'],
      },
      {
        title: 'Survey Booked', to: { name: 'jobs-survey-booked', params: { status: 'survey-booked' } },
        permissions: [modules.LEAD_JOBS + '.index', modules.LEADS + '.assigned-leads'],
      },
      {
        title: 'Survey Pending (Resch)', to: { name: 'jobs-survey-pending', params: { status: 'survey-pending' } },
        permissions: [modules.LEAD_JOBS + '.index', modules.LEADS + '.assigned-leads'],
      },
      {
        title: 'Survey Done', to: { name: 'jobs-survey-done', params: { status: 'survey-done' } },
        permissions: [modules.LEAD_JOBS + '.index', modules.LEADS + '.assigned-leads'],
      },
    ]
  },
] as VerticalNavItems
