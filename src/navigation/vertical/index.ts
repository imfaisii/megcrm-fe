import type { VerticalNavItems } from '@/@layouts/types'
import Home from './home'
import LeadManagement from './lead-management'
import UserManagement from './user-management'

export default [
  ...Home,
  ...LeadManagement,
  ...UserManagement,
] as VerticalNavItems
