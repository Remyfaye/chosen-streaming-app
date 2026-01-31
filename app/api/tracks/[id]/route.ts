import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            username: true,
            avatar: true,
            name: true,
            bio: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            comments: true,
            favorites: true,
            plays: true,
          },
        },
      },
    })

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    return NextResponse.json(track)
  } catch (error) {
    console.error('Get track error:', error)
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = (req as any).userId
    const { id } = await params

    const track = await prisma.track.findUnique({ where: { id } })
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    if (track.artistId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.track.delete({ where: { id } })
    return NextResponse.json({ message: 'Track deleted' })
  } catch (error) {
    console.error('Delete track error:', error)
    return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 })
  }
}
