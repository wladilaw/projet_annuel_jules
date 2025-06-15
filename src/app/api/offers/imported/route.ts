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

    const userId = session.user.id

    const importedOffers = await prisma.jobOffer.findMany({
      where: { userId: userId },
      orderBy: { importedAt: 'desc' },
    })

    return NextResponse.json(importedOffers)
  } catch (error: any) {
    console.error('Erreur lors de la récupération des offres importées:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 