import { useQuery } from '@tanstack/react-query'

import { getAdminAnalytics } from '../api/admin-analytics-api'
import type { AdminAnalyticsParams } from './types'

export const adminAnalyticsKeys = {
  all: ['admin-analytics'] as const,
  detail: (params: AdminAnalyticsParams) =>
    [...adminAnalyticsKeys.all, params] as const
}

export function useAdminAnalytics(params: AdminAnalyticsParams) {
  return useQuery({
    queryKey: adminAnalyticsKeys.detail(params),
    queryFn: () => getAdminAnalytics(params),
    staleTime: 60_000
  })
}
