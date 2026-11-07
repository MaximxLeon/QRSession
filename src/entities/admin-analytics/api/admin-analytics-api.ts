import { api } from '@/shared/api/instance'

import type { AdminAnalytics, AdminAnalyticsParams } from '../model/types'

export async function getAdminAnalytics(
  params: AdminAnalyticsParams
): Promise<AdminAnalytics> {
  const { data } = await api.get<AdminAnalytics>('/admin/analytics/dashboard', {
    params
  })

  return data
}
