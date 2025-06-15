'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  BookmarkIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface JobOfferData {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  contractType?: string | null;
  url?: string | null;
  importedAt: string;
}

export default function OffersPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [contractType, setContractType] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importedOffers, setImportedOffers] = useState<JobOfferData[]>([])
  const [importStatus, setImportStatus] = useState<{ [key: string]: 'idle' | 'importing' | 'success' | 'error' }>({})
  const [showFilters, setShowFilters] = useState(false)
  const [savedOffers, setSavedOffers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session?.user?.id) {
      fetchImportedOffers()
    }
  }, [session])

  const fetchImportedOffers = async () => {
    try {
      const response = await fetch('/api/offers/imported')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres importées.')
      }
      const data: JobOfferData[] = await response.json()
      setImportedOffers(data)
    } catch (err: any) {
      console.error('Erreur de chargement des offres importées:', err)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSearchResults([])

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        location,
        contractType,
      })
      const response = await fetch(`/api/offers?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la recherche d\'offres.')
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche d\'offres.')
    } finally {
      setLoading(false)
    }
  }

  const handleImportOffer = async (offer: any) => {
    if (!session?.user?.id) {
      setError('Veuillez vous connecter pour importer une offre.')
      return
    }

    setImportStatus(prev => ({ ...prev, [offer.id]: 'importing' }))
    setError(null)

    try {
      const response = await fetch('/api/offers/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: offer.title,
          description: offer.description,
          company: offer.company,
          location: offer.location,
          contractType: offer.contractType,
          url: offer.url,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'importation de l\'offre.')
      }

      setImportStatus(prev => ({ ...prev, [offer.id]: 'success' }))
      fetchImportedOffers()
    } catch (err: any) {
      setImportStatus(prev => ({ ...prev, [offer.id]: 'error' }))
      setError(err.message || 'Erreur lors de l\'importation de l\'offre.')
    }
  }

  const toggleSaveOffer = (offerId: string) => {
    setSavedOffers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(offerId)) {
        newSet.delete(offerId)
      } else {
        newSet.add(offerId)
      }
      return newSet
    })
  }

  const getContractTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cdi': return 'bg-green-100 text-green-800'
      case 'cdd': return 'bg-blue-100 text-blue-800'
      case 'stage': return 'bg-purple-100 text-purple-800'
      case 'alternance': return 'bg-orange-100 text-orange-800'
      case 'freelance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recherche d'Offres</h1>
        <p className="text-gray-600">Trouvez les opportunités parfaites pour votre carrière</p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card-modern p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MagnifyingGlassIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Rechercher des offres</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Filtres
          </motion.button>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          {/* Main Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
                Poste recherché
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search-query"
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-modern pl-10"
                  placeholder="Développeur React, Chef de projet, Designer..."
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-modern pl-10"
                  placeholder="Paris, Lyon, Remote..."
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="contract-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de contrat
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="contract-type"
                        name="contract-type"
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="input-modern pl-10"
                      >
                        <option value="">Tous les contrats</option>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Stage">Stage</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salaire minimum
                    </label>
                    <input
                      type="number"
                      className="input-modern"
                      placeholder="35000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expérience
                    </label>
                    <select className="input-modern">
                      <option value="">Toute expérience</option>
                      <option value="junior">Junior (0-2 ans)</option>
                      <option value="confirmed">Confirmé (3-5 ans)</option>
                      <option value="senior">Senior (5+ ans)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto relative overflow-hidden"
          >
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={loading ? 'opacity-0' : 'opacity-100'}>
              {loading ? 'Recherche...' : 'Rechercher des offres'}
            </span>
          </motion.button>
        </form>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center"
          >
            <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Résultats de recherche ({searchResults.length} offres)
            </h3>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select className="text-sm border-gray-300 rounded-lg">
                <option>Plus récentes</option>
                <option>Plus pertinentes</option>
                <option>Salaire croissant</option>
                <option>Salaire décroissant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {searchResults.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-modern p-6 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {offer.title}
                        </h4>
                        <div className="flex items-center text-gray-600 mb-2">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">{offer.company}</span>
                          <span className="mx-2">•</span>
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{offer.location}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleSaveOffer(offer.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        {savedOffers.has(offer.id) ? (
                          <BookmarkSolidIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <BookmarkIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.button>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {offer.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {offer.contractType && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContractTypeColor(offer.contractType)}`}>
                            {offer.contractType}
                          </span>
                        )}
                        <div className="flex items-center text-gray-500 text-xs">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>Il y a 2 jours</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {offer.url && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={offer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-xs px-3 py-1"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Voir l'offre
                          </motion.a>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleImportOffer(offer)}
                          disabled={importStatus[offer.id] === 'importing'}
                          className="btn-primary text-xs px-3 py-1 relative overflow-hidden"
                        >
                          {importStatus[offer.id] === 'importing' && (
                            <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <span className={importStatus[offer.id] === 'importing' ? 'opacity-0' : 'opacity-100'}>
                            {importStatus[offer.id] === 'success' ? 'Importée' : 'Importer'}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Imported Offers */}
      {importedOffers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mes offres sauvegardées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importedOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-modern p-4 card-hover"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{offer.title}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  <span>{offer.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Importée le {new Date(offer.importedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/offers/${offer.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Voir détails →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !loading && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}
    </div>
  )
} 