import { useState, useEffect, useCallback } from 'react'

// Types pour le localStorage hook
type SetValue<T> = T | ((prevValue: T) => T)

interface UseLocalStorageOptions<T> {
  defaultValue: T
  serializer?: {
    serialize: (value: T) => string
    deserialize: (value: string) => T
  }
}

// Hook personnalisé pour localStorage avec type-safety
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): [T, (value: SetValue<T>) => void, () => void] {
  const { defaultValue, serializer } = options

  // Serializer par défaut
  const defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  }

  const ser = serializer || defaultSerializer

  // Fonction pour lire depuis localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return ser.deserialize(item)
    } catch (error) {
      console.warn(`Erreur lors de la lecture de localStorage pour la clé "${key}":`, error)
      return defaultValue
    }
  }, [key, defaultValue, ser])

  // État local
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Fonction pour écrire dans localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value
        setStoredValue(newValue)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, ser.serialize(newValue))
          
          // Déclencher un événement personnalisé pour synchroniser entre onglets
          window.dispatchEvent(
            new CustomEvent('local-storage-change', {
              detail: { key, newValue },
            })
          )
        }
      } catch (error) {
        console.warn(`Erreur lors de l'écriture dans localStorage pour la clé "${key}":`, error)
      }
    },
    [key, storedValue, ser]
  )

  // Fonction pour supprimer la clé
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        
        window.dispatchEvent(
          new CustomEvent('local-storage-change', {
            detail: { key, newValue: null },
          })
        )
      }
    } catch (error) {
      console.warn(`Erreur lors de la suppression de localStorage pour la clé "${key}":`, error)
    }
  }, [key, defaultValue])

  // Écouter les changements du localStorage (pour synchroniser entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(ser.deserialize(e.newValue))
        } catch (error) {
          console.warn(`Erreur lors de la synchronisation localStorage pour la clé "${key}":`, error)
        }
      }
    }

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        if (e.detail.newValue === null) {
          setStoredValue(defaultValue)
        } else {
          setStoredValue(e.detail.newValue)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('local-storage-change', handleCustomStorageChange as EventListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('local-storage-change', handleCustomStorageChange as EventListener)
      }
    }
  }, [key, defaultValue, ser])

  return [storedValue, setValue, removeValue]
}

// Hook simplifié pour les types primitifs
export function useLocalStorageState<T extends string | number | boolean>(
  key: string,
  defaultValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  return useLocalStorage(key, { defaultValue })
}

// Hook pour les objets avec validation de schéma
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T,
  validator?: (value: unknown) => value is T
): [T, (value: SetValue<T>) => void, () => void] {
  const serializer = {
    serialize: JSON.stringify,
    deserialize: (value: string): T => {
      try {
        const parsed = JSON.parse(value)
        if (validator && !validator(parsed)) {
          console.warn(`Données invalides dans localStorage pour la clé "${key}", utilisation de la valeur par défaut`)
          return defaultValue
        }
        return parsed
      } catch {
        return defaultValue
      }
    }
  }

  return useLocalStorage(key, { defaultValue, serializer })
}

// Hook pour les tableaux
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
): [T[], (value: SetValue<T[]>) => void, () => void, (item: T) => void, (predicate: (item: T) => boolean) => void] {
  const [array, setArray, removeArray] = useLocalStorage(key, { defaultValue })

  const addItem = useCallback((item: T) => {
    setArray(prev => [...prev, item])
  }, [setArray])

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setArray(prev => prev.filter(item => !predicate(item)))
  }, [setArray])

  return [array, setArray, removeArray, addItem, removeItem]
}

// Utilitaires pour la gestion des erreurs localStorage
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false
    
    const test = '__localStorage_test__'
    window.localStorage.setItem(test, 'test')
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function getLocalStorageSize(): number {
  if (!isLocalStorageAvailable()) return 0
  
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

export function clearLocalStorage(keysToKeep: string[] = []): void {
  if (!isLocalStorageAvailable()) return
  
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && !keysToKeep.includes(key)) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key))
} 