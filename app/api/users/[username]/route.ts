import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = await params

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        userType: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            uploads: true,
          },
        },
        artistProfile: {
          select: {
            totalStreams: true,
            totalEarnings: true,
            isVerified: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const userId = (req as any).userId
    const { username } = await params
    const { name, bio, avatar } = await req.json()

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, avatar },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
