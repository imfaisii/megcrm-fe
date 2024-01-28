import useApiFetch from '@/composables/useApiFetch'
import { defaultPagination } from '@/constants/pagination'
import { useToast } from '@/plugins/toastr'
import { EventBus } from '@/utils/useEventBus'
import { getExceptionMessage, reshapeParams } from '@/utils/useHelper'
import { defineStore } from 'pinia'

type UserData = {
  name: string
  email: string
  roles: number[]
  password: string
  password_confirmation: string
  status: string
}

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
  const selectedLead = ref<any>(null)
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

  const isLeadSelected = computed(() => !!selectedLead.value)

  const fetchLeads = async (options = {}) => {
    isLoading.value = true
    const { data, meta: serverMeta } = await useApiFetch(reshapeParams(endPoint, meta, options))
    leads.value = data.leads
    meta.value = serverMeta
    isLoading.value = false
  }

  const getExtras = async (options = {}) => {
    isLoading.value = true
    const { data } = await useApiFetch('/lead-extras')
    measures.value = data?.measures ?? []
    jobTypes.value = data?.job_types ?? []
    fuelTypes.value = data?.fuel_types ?? []
    benefitTypes.value = data?.benefit_types ?? []
    surveyors.value = data?.surveyors ?? []
    leadGenerators.value = data?.lead_generators ?? []
    leadSources.value = data?.lead_sources ?? []
    isLoading.value = false
  }

  const storeLead = async (payload: any, options: any = { method: 'POST' }) => {
    try {
      isLoading.value = true
      await useApiFetch('/leads', {
        data: payload,
        ...options,
      })
      await fetchLeads()
      $toast.success('Lead was saved successfully.')
      EventBus.$emit('hide-lead-dialog')
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  const deleteLead = async (leadId: number, options = { method: 'DELETE' }) => {
    try {
      isLoading.value = true
      await useApiFetch(`${endPoint}/${leadId}`, options)
      $toast.success('Lead was deleted successfully.')
      await fetchLeads()
    } catch (error) {
      $toast.error(getExceptionMessage(error))
    } finally {
      isLoading.value = false
    }
  }

  return {
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
    meta,

    fetchLeads,
    storeLead,
    deleteLead,
    getExtras
  }
})
