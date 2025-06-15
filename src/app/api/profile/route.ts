import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const userId = session.user.id
    const { firstName, lastName, email, bio } = await request.json()

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        // Pour l'instant, nous mettons la bio dans le premier CV de l'utilisateur ou nous la créons si aucun CV n'existe.
        // Plus tard, cette logique pourra être affinée pour gérer des profils plus complexes.
        cvs: {
          upsert: {
            where: { userId_fileName: { userId, fileName: 'manuel_profile' } }, // Clé unique pour le profil manuel
            create: {
              fileName: 'manuel_profile',
              fileType: 'text/plain',
              content: bio || '',
            },
            update: {
              content: bio || '',
            },
          },
        },
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 