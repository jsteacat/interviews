import type { ComputedRef } from 'vue'

export type InterviewResult = 'Refusal' | 'Offer'

export interface IMenuItem {
  label: string
  icon: string
  path: string
  visible: ComputedRef<boolean>
}

export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date | null
  salaryFrom?: number
  salaryTo?: number
  stages?: IStage[]
  result?: InterviewResult
}

export interface IStage {
  name: string
  date: Date | null
  description: string
}
