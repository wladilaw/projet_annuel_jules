import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const contractType = searchParams.get('contractType') || ''

    // TODO: Implémenter la logique de scraping réelle ici
    // Pour l'instant, on retourne des données factices filtrées
    const mockOffers = [
      {
        id: '1',
        title: 'Développeur Fullstack (H/F) - CDI',
        description: 'Nous recherchons un développeur Fullstack passionné par les nouvelles technologies (React, Node.js, PostgreSQL). Rejoignez notre équipe dynamique pour travailler sur des projets innovants.',
        company: 'Tech Solutions',
        location: 'Paris, France',
        contractType: 'CDI',
        url: 'https://example.com/offer/1',
      },
      {
        id: '2',
        title: 'Alternance Développeur Web Junior (H/F)',
        description: 'Rejoignez notre agence digitale en tant qu'alternant développeur web. Vous travaillerez sur la création de sites e-commerce et applications mobiles.',
        company: 'Digital Agency',
        location: 'Lyon, France',
        contractType: 'Alternance',
        url: 'https://example.com/offer/2',
      },
      {
        id: '3',
        title: 'Chef de Projet IT (H/F)',
        description: 'Leader en solutions logicielles, nous recherchons un Chef de Projet IT expérimenté pour piloter nos équipes de développement.',
        company: 'Global Tech',
        location: 'Marseille, France',
        contractType: 'CDI',
        url: 'https://example.com/offer/3',
      },
      {
        id: '4',
        title: 'Stage Marketing Digital (H/F)',
        description: 'Immersion complète dans le monde du marketing digital. Participez à l'élaboration et au suivi de nos campagnes.',
        company: 'Marketing Pro',
        location: 'Bordeaux, France',
        contractType: 'Stage',
        url: 'https://example.com/offer/4',
      },
    ]

    const filteredOffers = mockOffers.filter(offer => {
      const matchesQuery = !query || 
        offer.title.toLowerCase().includes(query.toLowerCase()) ||
        offer.description.toLowerCase().includes(query.toLowerCase()) ||
        offer.company.toLowerCase().includes(query.toLowerCase())

      const matchesLocation = !location || offer.location.toLowerCase().includes(location.toLowerCase())
      const matchesContractType = !contractType || offer.contractType?.toLowerCase() === contractType.toLowerCase()

      return matchesQuery && matchesLocation && matchesContractType
    })

    return NextResponse.json(filteredOffers)
  } catch (error: any) {
    console.error('Erreur lors de la recherche d\'offres:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 