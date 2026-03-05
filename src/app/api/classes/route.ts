import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createClassSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().min(1),
  grade: z.number().int().min(1).max(12),
  supervisorId: z.string().optional(),
})

const updateClassSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().min(1).optional(),
  grade: z.number().int().min(1).max(12).optional(),
  supervisorId: z.string().optional(),
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
    const grade = searchParams.get("grade") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }

    if (grade) {
      where.grade = parseInt(grade)
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          supervisor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.class.count({ where }),
    ])

    return NextResponse.json({
      classes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching classes:", error)
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
    const data = createClassSchema.parse(body)

    // Check if class name already exists
    const existingClass = await prisma.class.findUnique({
      where: { name: data.name },
    })

    if (existingClass) {
      return NextResponse.json({ error: "Class name already exists" }, { status: 400 })
    }

    // Verify supervisor exists if provided
    if (data.supervisorId) {
      const supervisorExists = await prisma.teacher.findUnique({
        where: { id: data.supervisorId },
      })

      if (!supervisorExists) {
        return NextResponse.json({ error: "Supervisor not found" }, { status: 400 })
      }
    }

    const newClass = await prisma.class.create({
      data,
      include: {
        supervisor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
