import type { VerticalNavItems } from '@/@layouts/types'
import CallCenter from './call-center'
import Home from './home'
import LeadManagement from './lead-management'
import Misc from './misc'
import UserManagement from './user-management'

export default [
  ...Home,
  ...LeadManagement,
  ...CallCenter,
  ...Misc,
  ...UserManagement,
] as VerticalNavItems
