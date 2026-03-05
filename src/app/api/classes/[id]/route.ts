import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateClassSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().min(1).optional(),
  grade: z.number().int().min(1).max(12).optional(),
  supervisorId: z.string().optional().nullable(),
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

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        supervisor: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Error fetching class:", error)
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
    const data = updateClassSchema.parse(body)

    if (data.name) {
      const existingClass = await prisma.class.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
      })

      if (existingClass) {
        return NextResponse.json({ error: "Class name already exists" }, { status: 400 })
      }
    }

    const classData = await prisma.class.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.grade && { grade: data.grade }),
        ...(data.supervisorId !== undefined && {
          supervisorId: data.supervisorId,
        }),
      },
      include: {
        supervisor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(classData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating class:", error)
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

    await prisma.class.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("Error deleting class:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
