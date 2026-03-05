import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcrypt from "bcryptjs"

// Validation schema for teacher creation
const createTeacherSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  teacherId: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
})

const updateTeacherSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
})

// GET /api/teachers - List all teachers with pagination and filters
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
            { teacherId: { contains: search, mode: "insensitive" as const } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              image: true,
            },
          },
          subjects: {
            select: {
              id: true,
              name: true,
            },
          },
          classes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.teacher.count({ where }),
    ])

    return NextResponse.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = createTeacherSchema.parse(body)

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Check if teacherId already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { teacherId: data.teacherId },
    })

    if (existingTeacher) {
      return NextResponse.json({ error: "Teacher ID already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user and teacher in a transaction
    const teacher = await prisma.teacher.create({
      data: {
        teacherId: data.teacherId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        photo: data.photo,
        user: {
          create: {
            email: data.email,
            password: hashedPassword,
            role: "TEACHER",
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
