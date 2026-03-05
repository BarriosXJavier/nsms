import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url().optional(),
  grade: z.number().int().min(1).max(12).optional(),
  classId: z.string().optional(),
})

// GET /api/students/[id] - Get a single student
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
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            image: true,
            role: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            supervisor: {
              select: {
                name: true,
              },
            },
          },
        },
        parents: {
          select: {
            id: true,
            name: true,
            phone: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        results: {
          include: {
            subject: true,
            exam: {
              select: {
                title: true,
                date: true,
              },
            },
            assignment: {
              select: {
                title: true,
                dueDate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        attendances: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/students/[id] - Update a student
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
    const data = updateStudentSchema.parse(body)

    // If classId is being updated, verify it exists
    if (data.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: data.classId },
      })

      if (!classExists) {
        return NextResponse.json({ error: "Class not found" }, { status: 400 })
      }
    }

    const { id } = await params
    const student = await prisma.student.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
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

    return NextResponse.json(student)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/students/[id] - Delete a student
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
    // Delete student (will cascade delete user due to onDelete: Cascade)
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
