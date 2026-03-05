import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcrypt from "bcryptjs"

const createParentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
})

const updateParentSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}

    const [parents, total] = await Promise.all([
      prisma.parent.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              image: true,
            },
          },
          students: {
            select: {
              id: true,
              name: true,
              studentId: true,
              class: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.parent.count({ where }),
    ])

    return NextResponse.json({
      parents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching parents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = createParentSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const parent = await prisma.parent.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        user: {
          create: {
            email: data.email,
            password: hashedPassword,
            role: "PARENT",
          },
        },
        ...(data.studentIds && {
          students: {
            connect: data.studentIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        students: true,
      },
    })

    return NextResponse.json(parent, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating parent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
