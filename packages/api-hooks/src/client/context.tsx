import React, { createContext, useContext, useMemo } from 'react'
import { ApiClient, type ApiClientConfig } from './client'

interface ApiContextValue {
  client: ApiClient
}

const ApiContext = createContext<ApiContextValue | null>(null)

export interface ApiProviderProps {
  config: ApiClientConfig
  children: React.ReactNode
}

export function ApiProvider({ config, children }: ApiProviderProps) {
  const client = useMemo(() => new ApiClient(config), [config])

  return (
    <ApiContext.Provider value={{ client }}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApiClient(): ApiClient {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApiClient must be used within ApiProvider')
  }
  return context.client
}