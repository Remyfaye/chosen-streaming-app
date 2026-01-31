import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/middleware'

const prisma = new PrismaClient()

async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const userId = (req as any).userId
      const { title, description, audioUrl, coverUrl, duration, genre } = await req.json()

      const track = await prisma.track.create({
        data: {
          title,
          description,
          artistId: userId,
          audioUrl,
          coverUrl,
          duration,
          genre,
        },
        include: {
          artist: {
            select: {
              id: true,
              username: true,
              avatar: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json(track, { status: 201 })
    } catch (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Failed to upload track' }, { status: 500 })
    }
  }

  if (req.method === 'GET') {
    try {
      const { searchParams } = new URL(req.url)
      const genre = searchParams.get('genre')
      const limit = parseInt(searchParams.get('limit') || '20')
      const offset = parseInt(searchParams.get('offset') || '0')

      const where = genre ? { genre } : {}

      const tracks = await prisma.track.findMany({
        where,
        include: {
          artist: {
            select: {
              id: true,
              username: true,
              avatar: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      })

      const total = await prisma.track.count({ where })

      return NextResponse.json({ tracks, total, limit, offset })
    } catch (error) {
      console.error('Get tracks error:', error)
      return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export const POST = withAuth(handler)
export const GET = handler
