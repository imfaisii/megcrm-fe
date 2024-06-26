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

export const sortToString = (sortItem: { sort_by: string, type: string }) => {
  const { sort_by, type } = sortItem
  const sortKey = type === 'desc' ? `-${sort_by}` : sort_by

  return `${sortKey}`
}

export const reshapeParams = (url: string, meta: any = {}, options: any) => {
  let mergedParams = {
    ...options,
    ...meta,
    page: meta?.current_page
  }

  if (meta?.sort) {
    mergedParams = {
      ...mergedParams,
      sort: sortToString(meta.sort)
    }
  }

  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(mergedParams) as any) {
    if (value !== null && value !== undefined && value !== '' && value !== 'undefined' && ['page', 'per_page', 'sort', 'include', 'all'].includes(key)) {
      query.append(key, value)
    }
  }

  // Add filters from meta.filters
  if (meta?.filters) {
    for (const [filterKey, filterValue] of Object.entries(mergedParams.filters)) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        query.append(`filter[${filterKey}]`, filterValue);
      }

      if (!Array.isArray(filterValue)) {
        query.append(`filter[${filterKey}]`, filterValue);
      }
    }
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

export const removeEmptyAndNull = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== null && item !== undefined && item !== '');
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      removeEmptyAndNull(value),
    ]).filter(([key, value]) => value !== null && value !== undefined && value !== '')
  );
}
