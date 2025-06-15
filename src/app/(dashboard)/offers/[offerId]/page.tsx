'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface JobOfferData {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  contractType?: string | null;
  url?: string | null;
  importedAt: string;
  updatedAt: string;
}

export default function OfferDetailPage() {
  const params = useParams()
  const offerId = params.offerId as string
  const [offer, setOffer] = useState<JobOfferData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (offerId) {
      fetchOfferDetails()
    }
  }, [offerId])

  const fetchOfferDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/offers/${offerId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des détails de l\'offre.')
      }
      const data: JobOfferData = await response.json()
      setOffer(data)
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les détails de l\'offre.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Chargement des détails de l'offre...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">Erreur : {error}</div>
        <Link href="/dashboard/offers" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500">Retour à la liste des offres</Link>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="text-sm text-yellow-700">Aucune offre trouvée.</div>
        <Link href="/dashboard/offers" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500">Retour à la liste des offres</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Détails de l'Offre</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{offer.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{offer.company} - {offer.location}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Type de contrat</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{offer.contractType || 'Non spécifié'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">URL de l'offre</dt>
              <dd className="mt-1 text-sm text-blue-600 hover:text-blue-800 sm:mt-0 sm:col-span-2">
                {offer.url ? (
                  <a href={offer.url} target="_blank" rel="noopener noreferrer">{offer.url}</a>
                ) : (
                  'Non disponible'
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" dangerouslySetInnerHTML={{ __html: offer.description.replace(/\n/g, '<br/>') }}></dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Importée le</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(offer.importedAt).toLocaleDateString()} à {new Date(offer.importedAt).toLocaleTimeString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-x-3">
        <Link
          href="/dashboard/offers"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Retour à la liste
        </Link>
        {/* TODO: Ajouter un bouton pour générer une lettre de motivation à partir de cette offre */}
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Générer une lettre de motivation
        </button>
      </div>
    </div>
  )
} 