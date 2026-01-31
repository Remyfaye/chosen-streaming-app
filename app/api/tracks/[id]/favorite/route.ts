import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/middleware'

const prisma = new PrismaClient()

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = (req as any).userId
  const { id } = await params

  try {
    const track = await prisma.track.findUnique({ where: { id } })
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    if (req.method === 'POST') {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          trackId: id,
        },
      })
      return NextResponse.json(favorite, { status: 201 })
    }

    if (req.method === 'DELETE') {
      await prisma.favorite.delete({
        where: {
          userId_trackId: {
            userId,
            trackId: id,
          },
        },
      })
      return NextResponse.json({ message: 'Removed from favorites' })
    }
  } catch (error) {
    console.error('Favorite error:', error)
    return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 })
  }
}

export const POST = withAuth(handler)
export const DELETE = withAuth(handler)
