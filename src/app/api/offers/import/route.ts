import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { title, description, company, location, contractType, url } = await request.json()

    if (!title || !description || !company || !location) {
      return NextResponse.json({ error: 'Les champs obligatoires (titre, description, entreprise, localisation) sont manquants.' }, { status: 400 })
    }

    const userId = session.user.id

    const jobOffer = await prisma.jobOffer.create({
      data: {
        userId,
        title,
        description,
        company,
        location,
        contractType,
        url,
      },
    })

    return NextResponse.json({ message: 'Offre importée avec succès', jobOfferId: jobOffer.id })
  } catch (error: any) {
    console.error('Erreur lors de l\'importation de l\'offre:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 