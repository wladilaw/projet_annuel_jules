import { useState, useCallback, useRef } from 'react'
import type { ApiResponse, ApiError } from '@/types/api'

// Types pour le hook useApi
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiOptions {
  initialData?: any
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
  retries?: number
}

// Hook personnalisé pour gérer les appels API
export function useApi<T = any>(options: UseApiOptions = {}) {
  const { initialData = null, onSuccess, onError, retries = 0 } = options
  
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (
    url: string,
    config: RequestInit = {},
    attemptCount = 0
  ): Promise<T | null> => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Créer un nouveau contrôleur d'abandon
    abortControllerRef.current = new AbortController()

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        ...config,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      })

      if (!response.ok) {
        const errorData: ApiResponse = await response.json().catch(() => ({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        }))

        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      setState({
        data: result.data || null,
        loading: false,
        error: null,
      })

      if (onSuccess && result.data) {
        onSuccess(result.data)
      }

      return result.data || null

    } catch (error: any) {
      // Ignorer les erreurs d'abandon
      if (error.name === 'AbortError') {
        return null
      }

      const apiError: ApiError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Une erreur inconnue est survenue',
        details: error.details || {}
      }

      // Retry logic
      if (attemptCount < retries) {
        return execute(url, config, attemptCount + 1)
      }

      setState({
        data: null,
        loading: false,
        error: apiError,
      })

      if (onError) {
        onError(apiError)
      }

      throw apiError
    }
  }, [onSuccess, onError, retries])

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      data: initialData,
      loading: false,
      error: null,
    })
  }, [initialData])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    cancel,
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
  }
}

// Hook spécialisé pour les requêtes GET
export function useGet<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const get = useCallback(() => {
    return api.execute(url, { method: 'GET' })
  }, [api, url])

  return {
    ...api,
    get,
  }
}

// Hook spécialisé pour les requêtes POST
export function usePost<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const post = useCallback((data?: any) => {
    return api.execute(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }, [api, url])

  return {
    ...api,
    post,
  }
}

// Hook spécialisé pour les requêtes PUT
export function usePut<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const put = useCallback((data?: any) => {
    return api.execute(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }, [api, url])

  return {
    ...api,
    put,
  }
}

// Hook spécialisé pour les requêtes DELETE
export function useDelete<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const del = useCallback(() => {
    return api.execute(url, { method: 'DELETE' })
  }, [api, url])

  return {
    ...api,
    delete: del,
  }
}

// Hook pour upload de fichiers
export function useFileUpload<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const upload = useCallback((file: File, additionalData?: Record<string, any>) => {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return api.execute(url, {
      method: 'POST',
      body: formData,
      headers: {
        // Ne pas définir Content-Type pour FormData (le navigateur le fera automatiquement)
      },
    })
  }, [api, url])

  return {
    ...api,
    upload,
  }
} 