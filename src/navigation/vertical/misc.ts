import type { VerticalNavItems } from '@/@layouts/types'

export default [
  { heading: 'Miscellaneous' },
  {
    title: 'Job Types',
    icon: { icon: 'mdi-briefcase-outline' },
    to: 'job-types',
  },
  {
    title: 'Fuel Types',
    icon: { icon: 'mdi-fuel' },
    to: 'fuel-types',
  },
  {
    title: 'Benefit Types',
    icon: { icon: 'mdi-plus-circle-outline' },
    to: 'benefit-types',
  },
  {
    title: 'Surveyors',
    icon: { icon: 'mdi-account-multiple-plus-outline' },
    to: 'surveyors',
  },
  {
    title: 'Lead Generators',
    icon: { icon: 'mdi-account-multiple-plus-outline' },
    to: 'lead-generators',
  },
  {
    title: 'Lead Sources',
    icon: { icon: 'mdi-source-branch' },
    to: 'lead-sources',
  },
  {
    title: 'Measures',
    icon: { icon: 'mdi-tape-measure' },
    to: 'measures',
  },
] as VerticalNavItems
