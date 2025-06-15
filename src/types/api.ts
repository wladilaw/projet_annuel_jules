// Types pour les réponses API standardisées
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Types pour les requêtes d'authentification
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  token?: string
}

// Types pour l'upload de CV
export interface CVUploadRequest {
  file: File
  userId: string
}

export interface CVParseResponse {
  fileName: string
  fileType: string
  content: string
  extractedData: {
    skills?: string[]
    experience?: string[]
    education?: string[]
    contact?: {
      email?: string
      phone?: string
      address?: string
    }
  }
}

// Types pour les offres d'emploi
export interface JobOfferSearchParams {
  query?: string
  location?: string
  contractType?: string
  company?: string
  page?: number
  limit?: number
}

export interface JobOfferResponse {
  offers: Array<{
    id: string
    title: string
    description: string
    company: string
    location: string
    contractType?: string
    url?: string
    importedAt: string
    companyInfo?: {
      website?: string
      values?: string
    }
  }>
  totalCount: number
  currentPage: number
  totalPages: number
}

// Types pour les erreurs API
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Types pour la pagination
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Types pour les filtres
export interface CVFilters {
  fileType?: string[]
  uploadDateFrom?: Date
  uploadDateTo?: Date
}

export interface JobOfferFilters {
  contractTypes?: string[]
  locations?: string[]
  companies?: string[]
  importDateFrom?: Date
  importDateTo?: Date
} 