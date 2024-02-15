import { Comment } from '@/components/leads/LeadsTable.vue'
import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { LeadStatus } from '@/stores/leads/useLeadStatusesStore'
import { EventBus } from '@/utils/useEventBus'
import { getExceptionMessage, handleError, reshapeParams, setQueryParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

type BenefitType = {
  name: string
}

type FuelType = {
  name: string
}

type JobType = {
  name: string
}

type LeadGenerator = {
  name: string
}

type LeadSource = {
  name: string
}

type Measure = {
  name: string
}

type Surveyor = {
  name: string
}

export const useLeadsStore = defineStore('leads', () => {
  const endPoint = '/leads'
  const leads = ref([])
  const selectedLead = ref<any>({
    benefits: [],
    cell_centers: []
  })
  const selectedId = ref<null | string | number>(null)
  const isLoading = ref(false)
  const meta = ref(defaultPagination)
  const $toast: any = useToast()
  const benefitTypes: Ref<BenefitType[]> = ref([])
  const fuelTypes: Ref<FuelType[]> = ref([])
  const jobTypes: Ref<JobType[]> = ref([])
  const leadGenerators: Ref<LeadGenerator[]> = ref([])
  const leadSources: Ref<LeadSource[]> = ref([])
  const measures: Ref<Measure[]> = ref([])
  const surveyors: Ref<Surveyor[]> = ref([])
  const leadStatuses: Ref<LeadStatus[]> = ref([])
  const leadTableStatuses: Ref<LeadStatus[]> = ref([])
  const leadJobTableStatuses: Ref<LeadStatus[]> = ref([])
  const errors = ref({})
  const router = useRouter()

  const isLeadSelected = computed(() => !!selectedLead.value?.id)

  const fetchLeads = async (options = {}) => {
    isLoading.value = true
    const { data, meta: serverMeta } = await useApiFetch(reshapeParams(endPoint, meta.value, options))
    leads.value = data.leads
    meta.value = serverMeta
    isLoading.value = false
  }

  const getExtras = async (force = false) => {
    if (leadStatuses.value.length === 0 || force) {
      isLoading.value = true
      const { data } = await useApiFetch('/lead-extras')
      measures.value = data?.measures ?? []
      jobTypes.value = data?.job_types ?? []
      fuelTypes.value = data?.fuel_types ?? []
      benefitTypes.value = data?.benefit_types ?? []
      surveyors.value = data?.surveyors ?? []
      leadGenerators.value = data?.lead_generators ?? []
      leadSources.value = data?.lead_sources ?? []
      leadStatuses.value = data?.lead_statuses ?? []
      leadTableStatuses.value = data?.lead_table_filters ?? []
      leadJobTableStatuses.value = data?.lead_jobs_filters ?? []
      isLoading.value = false
    }
  }

  const storeLead = async (payload: any, options: any = { method: 'POST' }, showAlert: boolean = true) => {
    try {
      errors.value = {}
      isLoading.value = true
      const { data } = await useApiFetch('/leads', {
        data: payload,
        ...options,
      })
      await fetchLeads({ include: "leadGenerator" })
      $toast.success('Lead was saved successfully.')
      EventBus.$emit('hide-lead-dialog')
      router.push({ name: "leads-edit-id", params: { id: data.lead.id } });
    } catch (error: any) {
      if (error?.response?.status === 422) {
        errors.value = error?.response?.data?.errors
      }

      if (showAlert) {
        $toast.error(getExceptionMessage(error))
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteLead = async (leadId: number, options = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      selectedId.value = leadId
      await useApiFetch(`${endPoint}/${leadId}`, options)
      $toast.success('Lead was deleted successfully.')
      await fetchLeads({ include: "leadGenerator" })
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
      selectedId.value = null
    }
  }

  const fetchLead = async (leadId: number, options = {}) => {
    try {
      isLoading.value = true
      const { data } = await useApiFetch(`${endPoint}/${leadId}?${setQueryParams(options)}`)
      selectedLead.value = data.lead
      selectedLead.value.benefits = data.lead?.benefits.map((i: any) => i.id)
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  const updateStatus = async (payload: Comment, options = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`/lead-status/${payload.leadId}`, {
        data: payload,
        ...options
      })
      $toast.success('Lead status was updated successfully.')
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const update = async (options = { method: 'PUT' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`/leads/${selectedLead.value.id}`, {
        data: selectedLead.value,
        ...options
      })
      $toast.success('Lead was updated successfully.')
    } catch (error) {
      handleError(error, errors)
    } finally {
      isLoading.value = false
    }
  }

  const checkIfCountryIsScotland = (n: string): boolean | null => {
    if (n === null) {
      return false;
    }

    const countryRegex = /--\s*(\w+(?:\s*\w+)*)/;
    const match = n.match(countryRegex);

    return match && match[1].toUpperCase() === "SCOTLAND";
  }


  return {
    leadTableStatuses,
    leadStatuses,
    leadJobTableStatuses,
    jobTypes,
    fuelTypes,
    leadGenerators,
    leadSources,
    benefitTypes,
    surveyors,
    measures,
    leads,
    isLoading,
    isLeadSelected,
    selectedLead,
    selectedId,
    errors,
    meta,

    checkIfCountryIsScotland,
    updateStatus,
    update,
    fetchLeads,
    fetchLead,
    storeLead,
    deleteLead,
    getExtras
  }
})
