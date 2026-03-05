import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateParentSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
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

    const parent = await prisma.parent.findUnique({
      where: { id },
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
          },
        },
      },
    })

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 })
    }

    return NextResponse.json(parent)
  } catch (error) {
    console.error("Error fetching parent:", error)
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
    const data = updateParentSchema.parse(body)

    const parent = await prisma.parent.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.studentIds && {
          students: {
            set: [],
            connect: data.studentIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(parent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating parent:", error)
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

    await prisma.parent.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Parent deleted successfully" })
  } catch (error) {
    console.error("Error deleting parent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
