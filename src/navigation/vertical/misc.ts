import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'MISCELLANEOUS' },
  {
    title: 'Extras',
    icon: { icon: 'mdi-plus-circle-outline' },
    children: [
      {
        title: 'Job Types',
        to: 'job-types',
      },
      {
        title: 'Fuel Types',
        to: 'fuel-types',
      },
      {
        title: 'Benefit Types',
        to: 'benefit-types',
      },
      {
        title: 'Surveyors',
        to: 'surveyors',
      },
      {
        title: 'Lead Generators',
        to: 'lead-generators',
      },
      {
        title: 'Lead Sources',
        to: 'lead-sources',
      },
      {
        title: 'Measures',
        to: 'measures',
      },
    ]
  },
] as VerticalNavItems
