import type { VerticalNavItems } from '@/@layouts/types'
import Home from './home'
import UserManagement from './user-management'

export default [
  ...Home,
  ...UserManagement,
] as VerticalNavItems
