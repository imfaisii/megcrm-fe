import { ACCESS_TOKEN_KEY, PROTECTED_URLS } from '@/constants/general'
import { useToast } from '@/plugins/toastr'
import { useAuthStore } from '@/stores/auth/useAuthStore'

export const isRequestingProtectedRoute = (to: any) => PROTECTED_URLS.some((prefix: any) => to.path.startsWith(prefix))
export const isRequestingPublicRoute = (to: any) => PROTECTED_URLS.some((prefix: string) => !to.path.startsWith(prefix))

export function isValidToken(token: any) {
  return token && token !== 'undefined'
}

export function notifyError(message: string) {
  const $toast = useToast()
  if ($toast) {
    $toast.error(message)
  }
  else { console.error('Notification service not available.') }
}

export async function authMiddleware(to: any, from: any, next: any) {
  const auth = useAuthStore()
  const token = useStorage(ACCESS_TOKEN_KEY, null)

  if (isValidToken(token.value) && !auth.isLoggedIn) {
    await auth.fetchUser()
  }

  if (isRequestingProtectedRoute(to) && !(auth.isLoggedIn || isValidToken(token.value))) {
    notifyError('User not logged in.')
    next('/login')
  }
  else if (isRequestingPublicRoute(to) && (auth.isLoggedIn || isValidToken(token.value))) {
    next('/dashboard')
  }
  else {
    next() // Proceed with the navigation
  }
}
