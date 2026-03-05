import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateSubjectSchema = z.object({
  name: z.string().min(1).optional(),
  teacherIds: z.array(z.string()).optional(),
})

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

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            exams: true,
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error fetching subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateSubjectSchema.parse(body)

    if (data.name) {
      const existingSubject = await prisma.subject.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
      })

      if (existingSubject) {
        return NextResponse.json({ error: "Subject name already exists" }, { status: 400 })
      }
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.teacherIds && {
          teachers: {
            set: [],
            connect: data.teacherIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    await prisma.subject.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
