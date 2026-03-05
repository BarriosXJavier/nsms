import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateTeacherSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
})

// GET /api/teachers/[id] - Get a single teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            image: true,
            role: true,
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
            grade: true,
          },
        },
        lessons: {
          include: {
            subject: true,
            class: true,
          },
        },
        exams: {
          include: {
            subject: true,
            class: true,
          },
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error fetching teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/teachers/[id] - Update a teacher
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = updateTeacherSchema.parse(body)

    const { id } = await params
    const teacher = await prisma.teacher.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(teacher)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/teachers/[id] - Delete a teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    // Delete teacher (will cascade delete user due to onDelete: Cascade)
    await prisma.teacher.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Teacher deleted successfully" })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
