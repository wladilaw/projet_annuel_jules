import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, CV, JobOffer } from '@/types/database'

// Types pour le store principal
interface AppState {
  // État de l'utilisateur
  user: User | null
  isAuthenticated: boolean
  
  // État des CV
  cvs: CV[]
  selectedCV: CV | null
  
  // État des offres d'emploi
  jobOffers: JobOffer[]
  selectedJobOffer: JobOffer | null
  
  // État de l'interface utilisateur
  ui: {
    sidebarOpen: boolean
    theme: 'light' | 'dark' | 'system'
    loading: {
      global: boolean
      cvs: boolean
      jobOffers: boolean
    }
    notifications: Notification[]
  }
  
  // Filtres et recherche
  filters: {
    cvs: {
      fileType?: string[]
      dateRange?: { from: Date; to: Date }
      searchQuery?: string
    }
    jobOffers: {
      contractTypes?: string[]
      locations?: string[]
      companies?: string[]
      dateRange?: { from: Date; to: Date }
      searchQuery?: string
    }
  }
}

// Types pour les actions
interface AppActions {
  // Actions utilisateur
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  
  // Actions CV
  setCVs: (cvs: CV[]) => void
  addCV: (cv: CV) => void
  updateCV: (id: string, updates: Partial<CV>) => void
  removeCV: (id: string) => void
  selectCV: (cv: CV | null) => void
  
  // Actions offres d'emploi
  setJobOffers: (offers: JobOffer[]) => void
  addJobOffer: (offer: JobOffer) => void
  updateJobOffer: (id: string, updates: Partial<JobOffer>) => void
  removeJobOffer: (id: string) => void
  selectJobOffer: (offer: JobOffer | null) => void
  
  // Actions UI
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setGlobalLoading: (loading: boolean) => void
  setCVsLoading: (loading: boolean) => void
  setJobOffersLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Actions filtres
  setCVFilters: (filters: Partial<AppState['filters']['cvs']>) => void
  setJobOfferFilters: (filters: Partial<AppState['filters']['jobOffers']>) => void
  clearCVFilters: () => void
  clearJobOfferFilters: () => void
  clearAllFilters: () => void
  
  // Actions utilitaires
  reset: () => void
}

// Type pour les notifications
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

// Type combiné pour le store
type AppStore = AppState & AppActions

// État initial
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cvs: [],
  selectedCV: null,
  jobOffers: [],
  selectedJobOffer: null,
  ui: {
    sidebarOpen: true,
    theme: 'system',
    loading: {
      global: false,
      cvs: false,
      jobOffers: false,
    },
    notifications: [],
  },
  filters: {
    cvs: {},
    jobOffers: {},
  },
}

// Création du store avec Zustand, devtools et persistence
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions utilisateur
        setUser: (user) => set({ user, isAuthenticated: !!user }, false, 'setUser'),
        
        login: (user) => set({ 
          user, 
          isAuthenticated: true 
        }, false, 'login'),
        
        logout: () => set({ 
          user: null, 
          isAuthenticated: false,
          cvs: [],
          jobOffers: [],
          selectedCV: null,
          selectedJobOffer: null,
        }, false, 'logout'),

        // Actions CV
        setCVs: (cvs) => set({ cvs }, false, 'setCVs'),
        
        addCV: (cv) => set((state) => ({ 
          cvs: [...state.cvs, cv] 
        }), false, 'addCV'),
        
        updateCV: (id, updates) => set((state) => ({
          cvs: state.cvs.map(cv => cv.id === id ? { ...cv, ...updates } : cv),
          selectedCV: state.selectedCV?.id === id 
            ? { ...state.selectedCV, ...updates } 
            : state.selectedCV
        }), false, 'updateCV'),
        
        removeCV: (id) => set((state) => ({
          cvs: state.cvs.filter(cv => cv.id !== id),
          selectedCV: state.selectedCV?.id === id ? null : state.selectedCV
        }), false, 'removeCV'),
        
        selectCV: (cv) => set({ selectedCV: cv }, false, 'selectCV'),

        // Actions offres d'emploi
        setJobOffers: (offers) => set({ jobOffers: offers }, false, 'setJobOffers'),
        
        addJobOffer: (offer) => set((state) => ({ 
          jobOffers: [...state.jobOffers, offer] 
        }), false, 'addJobOffer'),
        
        updateJobOffer: (id, updates) => set((state) => ({
          jobOffers: state.jobOffers.map(offer => 
            offer.id === id ? { ...offer, ...updates } : offer
          ),
          selectedJobOffer: state.selectedJobOffer?.id === id 
            ? { ...state.selectedJobOffer, ...updates } 
            : state.selectedJobOffer
        }), false, 'updateJobOffer'),
        
        removeJobOffer: (id) => set((state) => ({
          jobOffers: state.jobOffers.filter(offer => offer.id !== id),
          selectedJobOffer: state.selectedJobOffer?.id === id ? null : state.selectedJobOffer
        }), false, 'removeJobOffer'),
        
        selectJobOffer: (offer) => set({ selectedJobOffer: offer }, false, 'selectJobOffer'),

        // Actions UI
        setSidebarOpen: (open) => set((state) => ({
          ui: { ...state.ui, sidebarOpen: open }
        }), false, 'setSidebarOpen'),
        
        toggleSidebar: () => set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
        }), false, 'toggleSidebar'),
        
        setTheme: (theme) => set((state) => ({
          ui: { ...state.ui, theme }
        }), false, 'setTheme'),
        
        setGlobalLoading: (loading) => set((state) => ({
          ui: { ...state.ui, loading: { ...state.ui.loading, global: loading } }
        }), false, 'setGlobalLoading'),
        
        setCVsLoading: (loading) => set((state) => ({
          ui: { ...state.ui, loading: { ...state.ui.loading, cvs: loading } }
        }), false, 'setCVsLoading'),
        
        setJobOffersLoading: (loading) => set((state) => ({
          ui: { ...state.ui, loading: { ...state.ui.loading, jobOffers: loading } }
        }), false, 'setJobOffersLoading'),
        
        addNotification: (notification) => {
          const id = Math.random().toString(36).substring(2, 15)
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date(),
            duration: notification.duration || 5000,
          }
          
          set((state) => ({
            ui: {
              ...state.ui,
              notifications: [...state.ui.notifications, newNotification]
            }
          }), false, 'addNotification')
          
          // Auto-remove notification after duration
          if (newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id)
            }, newNotification.duration)
          }
        },
        
        removeNotification: (id) => set((state) => ({
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter(n => n.id !== id)
          }
        }), false, 'removeNotification'),
        
        clearNotifications: () => set((state) => ({
          ui: { ...state.ui, notifications: [] }
        }), false, 'clearNotifications'),

        // Actions filtres
        setCVFilters: (filters) => set((state) => ({
          filters: {
            ...state.filters,
            cvs: { ...state.filters.cvs, ...filters }
          }
        }), false, 'setCVFilters'),
        
        setJobOfferFilters: (filters) => set((state) => ({
          filters: {
            ...state.filters,
            jobOffers: { ...state.filters.jobOffers, ...filters }
          }
        }), false, 'setJobOfferFilters'),
        
        clearCVFilters: () => set((state) => ({
          filters: { ...state.filters, cvs: {} }
        }), false, 'clearCVFilters'),
        
        clearJobOfferFilters: () => set((state) => ({
          filters: { ...state.filters, jobOffers: {} }
        }), false, 'clearJobOfferFilters'),
        
        clearAllFilters: () => set((state) => ({
          filters: { cvs: {}, jobOffers: {} }
        }), false, 'clearAllFilters'),

        // Actions utilitaires
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          // Persister seulement certaines parties du state
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          ui: {
            theme: state.ui.theme,
            sidebarOpen: state.ui.sidebarOpen,
          },
          filters: state.filters,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)

// Sélecteurs utilitaires pour optimiser les re-renders
export const useUser = () => useAppStore((state) => state.user)
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated)
export const useCVs = () => useAppStore((state) => state.cvs)
export const useSelectedCV = () => useAppStore((state) => state.selectedCV)
export const useJobOffers = () => useAppStore((state) => state.jobOffers)
export const useSelectedJobOffer = () => useAppStore((state) => state.selectedJobOffer)
export const useUIState = () => useAppStore((state) => state.ui)
export const useFilters = () => useAppStore((state) => state.filters)
export const useNotifications = () => useAppStore((state) => state.ui.notifications) 