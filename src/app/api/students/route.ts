import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcrypt from "bcryptjs"

// Validation schema for student creation
const createStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  studentId: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
  grade: z.number().int().min(1).max(12),
  classId: z.string(),
})

const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
  grade: z.number().int().min(1).max(12).optional(),
  classId: z.string().optional(),
})

// GET /api/students - List all students with pagination and filters
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
    const classId = searchParams.get("classId") || ""
    const grade = searchParams.get("grade") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { studentId: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (classId) {
      where.classId = classId
    }

    if (grade) {
      where.grade = parseInt(grade)
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              image: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          parents: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where }),
    ])

    return NextResponse.json({
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = createStudentSchema.parse(body)

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Check if studentId already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId: data.studentId },
    })

    if (existingStudent) {
      return NextResponse.json({ error: "Student ID already exists" }, { status: 400 })
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: data.classId },
    })

    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user and student in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "STUDENT",
        },
      })

      // Then create student
      const student = await tx.student.create({
        data: {
          studentId: data.studentId,
          name: data.name,
          phone: data.phone,
          address: data.address,
          photo: data.photo,
          grade: data.grade,
          userId: user.id,
          classId: data.classId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return student
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
