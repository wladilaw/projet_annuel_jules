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

    const cvs = await prisma.cV.findMany({
      where: { userId: userId },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(cvs)
  } catch (error: any) {
    console.error('Erreur lors de la récupération des CV:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 