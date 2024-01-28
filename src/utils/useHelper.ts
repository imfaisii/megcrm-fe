import { useToast } from '@/plugins/toastr'

/* This file has the global helper functions */
export const getExceptionMessage = (error: any) => error?.response?.data?.message ?? error.message

export const handleError = (error: any, errors: any) => {
  const $toast = useToast()

  if (error?.response?.status === 422) {
    errors.value = error?.response?.data?.errors
  }

  $toast.error(getExceptionMessage(error))
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const sortToString = (sortArray: any) => {
  return Array.isArray(sortArray)
    ? sortArray
      .map((sortItem: { key: string; order: string }) => {
        const { key, order } = sortItem
        const sortKey = order === 'desc' ? `-${key}` : key

        return `${sortKey}`
      })
      .join(',')
    : undefined
}

export const reshapeParams = (url: string, meta: any = null, options: any) => {
  let params = {}

  if (meta !== null) {
    params = {
      page: meta.value.current_page,
      sort: sortToString(meta.value.sort),
    }
  }

  const mergedParams = { ...params, ...options }
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(mergedParams) as any) {
    if (value !== null && value !== undefined && value !== '') { query.append(key, value) }
  }

  const queryString = query.toString()

  return queryString ? `${url}?${queryString}` : url
}

export const focusFirstErrorDiv = (fullPage = false) => {
  const errorDiv = document.getElementsByClassName("v-field--error")[0]

  if (fullPage) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    errorDiv.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}
