import type { VerticalNavItems } from '@/@layouts/types'
import Calendar from './calendar'
import Home from './home'
import LeadManagement from './lead-management'
import Misc from './misc'
import UserManagement from './user-management'

export default [
  ...Home,
  ...Calendar,
  ...LeadManagement,
  ...Misc,
  ...UserManagement,
] as VerticalNavItems
