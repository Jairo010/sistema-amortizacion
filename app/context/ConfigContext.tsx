"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
//import { getConfiguracion } from '@/app/utils/supabase/supabase.service'

interface ConfigContextType {
  config: any
  loading: boolean
  error: string | null
  refreshConfig: () => Promise<void>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = async () => {
    /*
    try {
      setLoading(true)
      const configData = await getConfiguracion("banco jairo")
      setConfig(configData[0])
      setError(null)
    } catch (err) {
      setError('Error al cargar la configuración')
      console.error('Error al cargar la configuración:', err)
    } finally {
      setLoading(false)
    }*/
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const refreshConfig = async () => {
    await loadConfig()
  }

  return (
    <ConfigContext.Provider value={{ config, loading, error, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig debe ser usado dentro de un ConfigProvider')
  }
  return context
} 