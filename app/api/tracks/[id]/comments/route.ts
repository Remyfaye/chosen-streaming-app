import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/middleware'

const prisma = new PrismaClient()

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = (req as any).userId
  const { id } = await params

  try {
    if (req.method === 'POST') {
      const { content } = await req.json()

      const comment = await prisma.comment.create({
        data: {
          content,
          userId,
          trackId: id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      })

      return NextResponse.json(comment, { status: 201 })
    }
  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}

export const POST = withAuth(handler)
