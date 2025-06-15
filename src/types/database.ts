// Types pour les entités de base de données basés sur le schéma Prisma
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  cvs?: CV[]
  jobOffers?: JobOffer[]
}

export interface CV {
  id: string
  userId: string
  user?: User
  fileName: string
  fileType: string
  content: string
  uploadedAt: Date
  updatedAt: Date
}

export interface JobOffer {
  id: string
  userId: string
  user?: User
  title: string
  description: string
  company: string
  location: string
  contractType?: string
  url?: string
  importedAt: Date
  updatedAt: Date
  companyInfoId?: string
  companyInfo?: CompanyInfo
}

export interface CompanyInfo {
  id: string
  companyName: string
  website?: string
  values?: string
  news?: string
  customNotes?: string
  createdAt: Date
  updatedAt: Date
  jobOffer?: JobOffer
}

// Types pour les données de création (sans champs auto-générés)
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'cvs' | 'jobOffers'>

export type CreateCVData = Omit<CV, 'id' | 'uploadedAt' | 'updatedAt' | 'user'>

export type CreateJobOfferData = Omit<JobOffer, 'id' | 'importedAt' | 'updatedAt' | 'user' | 'companyInfo'>

export type CreateCompanyInfoData = Omit<CompanyInfo, 'id' | 'createdAt' | 'updatedAt' | 'jobOffer'>

// Types pour les mises à jour (tous les champs optionnels sauf l'id)
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'cvs' | 'jobOffers'>>

export type UpdateCVData = Partial<Omit<CV, 'id' | 'userId' | 'uploadedAt' | 'updatedAt' | 'user'>>

export type UpdateJobOfferData = Partial<Omit<JobOffer, 'id' | 'userId' | 'importedAt' | 'updatedAt' | 'user' | 'companyInfo'>>

export type UpdateCompanyInfoData = Partial<Omit<CompanyInfo, 'id' | 'createdAt' | 'updatedAt' | 'jobOffer'>> 