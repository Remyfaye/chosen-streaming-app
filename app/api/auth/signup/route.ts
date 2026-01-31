import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hashPassword, generateToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, userType } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        userType: userType || 'LISTENER',
      },
    })

    // Create profile based on user type
    if (userType === 'ARTIST') {
      await prisma.artistProfile.create({
        data: { userId: user.id },
      })
    } else {
      await prisma.listenerProfile.create({
        data: { userId: user.id },
      })
    }

    const token = generateToken(user.id)

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          userType: user.userType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
