import { NextResponse } from 'next/server'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true)
    } else {
      cb(new Error('Seuls les fichiers PDF et DOCX sont autorisés !'))
    }
  },
}).single('cv')

export const config = {
  api: {
    bodyParser: false,
  },
}

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Convertir la requête Next.js en format compatible avec Multer
    const buffer = Buffer.from(await req.arrayBuffer())
    const reqWithFile = { ...req, body: buffer } as any

    // Créer une réponse factice pour Multer
    const res: any = new NextResponse()

    await runMiddleware(reqWithFile, res, upload)

    if (!reqWithFile.file) {
      return NextResponse.json({ error: 'Aucun fichier CV n\'a été téléversé.' }, { status: 400 })
    }

    let parsedContent = ''
    if (reqWithFile.file.mimetype === 'application/pdf') {
      const data = await pdfParse(reqWithFile.file.buffer)
      parsedContent = data.text
    } else if (reqWithFile.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: reqWithFile.file.buffer })
      parsedContent = result.value
    } else {
      return NextResponse.json({ error: 'Type de fichier non supporté.' }, { status: 400 })
    }

    // Sauvegarder dans la base de données
    const cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        fileName: reqWithFile.file.originalname,
        fileType: reqWithFile.file.mimetype,
        content: parsedContent,
      },
    })

    return NextResponse.json({ message: 'CV téléversé et parsé avec succès', cvId: cv.id })
  } catch (error: any) {
    console.error('Erreur lors du téléversement/parsing du CV:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 