import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: Request, { params }: { params: { offerId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { offerId } = params

    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        id: offerId,
        userId: session.user.id, // S'assurer que l'offre appartient à l'utilisateur
      },
    })

    if (!jobOffer) {
      return NextResponse.json({ error: 'Offre non trouvée ou non autorisée' }, { status: 404 })
    }

    return NextResponse.json(jobOffer)
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'offre:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 