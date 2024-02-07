import type { VerticalNavItems } from '@/@layouts/types'
import { modules } from '@/constants/modules'

const globalPermissions = [
  modules.BENEFIT_TYPES + '.*',
  modules.FUEL_TYPES + '.*',
  modules.JOB_TYPES + '.*',
  modules.MEASURES + '.*',
  modules.SURVEYORS + '.*',
  modules.LEAD_GENERATORS + '.*',
  modules.LEAD_SOURCES + '.*',
]

export default [
  {
    heading: 'MISCELLANEOUS',
    permissions: globalPermissions
  },
  {
    title: 'Extras',
    icon: { icon: 'mdi-plus-circle-outline' },
    permissions: globalPermissions,
    children: [
      {
        title: 'Job Types',
        to: 'job-types',
        permissions: [modules.JOB_TYPES + '.*'],
      },
      {
        title: 'Fuel Types',
        to: 'fuel-types',
        permissions: [modules.FUEL_TYPES + '.*'],
      },
      {
        title: 'Benefit Types',
        to: 'benefit-types',
        permissions: [modules.BENEFIT_TYPES + '.*'],
      },
      {
        title: 'Surveyors',
        to: 'surveyors',
        permissions: [modules.SURVEYORS + '.*'],
      },
      {
        title: 'Lead Generators',
        to: 'lead-generators',
        permissions: [modules.LEAD_GENERATORS + '.*'],
      },
      {
        title: 'Lead Sources',
        to: 'lead-sources',
        permissions: [modules.LEAD_SOURCES + '.*'],
      },
      {
        title: 'Measures',
        to: 'measures',
        permissions: [modules.MEASURES + '.*'],
      },
    ]
  },
] as VerticalNavItems
