# NSMS Agent Guidelines

This file contains essential information for AI coding agents working on the NSMS (Next School Management System) codebase.

## Tech Stack

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5 (beta) with JWT sessions
- **Validation**: Zod schemas
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui

## Build/Dev/Test Commands

```bash
# Development
bun dev                  # Start dev server (next dev)
bun run build            # Build for production
bun start                # Start production server
bun run lint             # Run ESLint

# Database Operations
bun run db:generate      # Generate Prisma Client (after schema changes)
bun run db:push          # Push schema to DB without migrations (dev)
bun run db:migrate       # Create and run migrations (production)
bun run db:studio        # Open Prisma Studio GUI
bun run db:seed          # Seed database with test data

# Package Management
bun install              # Install dependencies
bun add <package>        # Add a package
bun remove <package>     # Remove a package
```

**Note**: This project uses **Bun** as the package manager and runtime. All commands should use `bun` instead of `npm` or `yarn`. There are currently no test scripts configured. When adding tests, use `bun test` for all tests.

## Code Style Guidelines

### Import Order (4-tier with blank lines)

```typescript
// 1. Framework & Next.js
import { NextRequest, NextResponse } from "next/server"
import Image from "next/image"
import Link from "next/link"

// 2. Third-party libraries
import { z } from "zod"
import bcrypt from "bcryptjs"

// 3. Internal imports (@/ alias)
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

// 4. Type imports (if needed)
import type { Metadata } from "next"
```

### Formatting

- **No semicolons** anywhere
- **Double quotes** for all strings
- **2-space indentation**
- Opening brace on same line: `if (condition) {`
- Self-closing JSX tags: `<Image src="..." />`

### TypeScript Conventions

**Types for Props:**
```typescript
// Simple props: inline types
const UserCard = ({ type }: { type: string }) => { }

// Complex props: named types
type TableProps = {
  columns: { header: string; accessor: string }[]
  data: any[]
}
```

**Zod Schemas for Validation:**
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

// Optional fields for updates
const updateUserSchema = createUserSchema.partial()
```

**Type Extensions (module augmentation):**
```typescript
// src/types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"]
  }
}
```

### Naming Conventions

- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utils, `route.ts` for API routes
- **Components**: PascalCase matching filename, default export
- **Variables/Functions**: camelCase
- **Constants/Enums**: SCREAMING_SNAKE_CASE (Prisma enums: `UserRole.ADMIN`)
- **Database Models**: PascalCase singular (`User`, `Teacher`, `Class`)

### API Route Pattern (Standardized)

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Authorization check (role-based)
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 3. Parse & validate input
    const body = await request.json()
    const data = createSchema.parse(body)

    // 4. Business logic validation
    const existing = await prisma.model.findUnique({ where: { id: data.id } })
    if (existing) {
      return NextResponse.json({ error: "Already exists" }, { status: 400 })
    }

    // 5. Database operation
    const result = await prisma.model.create({ data })

    // 6. Success response
    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    // 7. Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    // 8. Generic error handling
    console.error("Error creating model:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

**HTTP Status Codes:**
- `200` - Success (GET, PATCH, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation/business logic errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```typescript
{ error: "Error message string" }
{ error: [{ message: "...", path: [...] }] }  // Zod errors
```

### Dynamic Route Params (Next.js 15+)

```typescript
// params is now async!
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // Must await params
  // ...
}
```

### Component Structure

**Client Component:**
```typescript
"use client"  // First line for interactivity/state/hooks

import { useState } from "react"
import { Button } from "@/components/ui/button"

const MyComponent = () => {
  const [state, setState] = useState("")
  
  return <div>{/* JSX */}</div>
}

export default MyComponent
```

**Server Component (default):**
```typescript
// No "use client" directive
// Can use async/await, database queries

const MyPage = async () => {
  const data = await prisma.model.findMany()
  
  return <div>{/* JSX */}</div>
}

export default MyPage
```

### Prisma Patterns

**Pagination Pattern:**
```typescript
const page = parseInt(searchParams.get("page") || "1")
const limit = parseInt(searchParams.get("limit") || "10")
const skip = (page - 1) * limit

const [items, total] = await Promise.all([
  prisma.model.findMany({ where, skip, take: limit }),
  prisma.model.count({ where }),
])

return NextResponse.json({
  items,
  pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
})
```

**Security - Never Expose Passwords:**
```typescript
include: {
  user: {
    select: {
      email: true,
      image: true,
      // Never select: password
    },
  },
}
```

**Search Pattern:**
```typescript
const where: any = {}

if (search) {
  where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { email: { contains: search, mode: "insensitive" } },
  ]
}
```

### Authentication & Authorization

**Check Auth:**
```typescript
const session = await auth()
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

**Check Role:**
```typescript
if (session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// Multiple roles
if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
```

**Password Hashing:**
```typescript
import bcrypt from "bcryptjs"

const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, user.password)
```

## Project-Specific Conventions

### Role System
- **Database Enum**: `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`
- **Routes**: `/admin`, `/teacher`, `/student`, `/parent` (lowercase)
- **Session**: Stored in `session.user.role`

### ID System
- **Primary Keys**: CUID via `@default(cuid())` (not UUID)
- **Custom IDs**: `teacherId`, `studentId` (unique strings for display)

### Database Schema Patterns
```prisma
model Example {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations with cascade delete
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### File Organization
```
src/
├── app/
│   ├── (dashboard)/          # Route group (doesn't affect URL)
│   │   ├── layout.tsx        # Shared dashboard layout
│   │   ├── admin/page.tsx    # /admin
│   │   ├── list/teachers/page.tsx  # /list/teachers
│   ├── api/
│   │   ├── teachers/route.ts       # GET, POST
│   │   └── teachers/[id]/route.ts  # GET, PATCH, DELETE
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── Forms/                # Form components
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma singleton
│   └── utils.ts             # Utilities (cn helper)
└── types/                   # Type definitions
```

## Common Patterns

**Tailwind Class Utility:**
```typescript
import { cn } from "@/lib/utils"

className={cn("base-classes", condition && "conditional-classes", className)}
```

**Conditional Rendering:**
```typescript
{role === "admin" && <AdminPanel />}
{isLoading ? <Spinner /> : <Content />}
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:3000 in dev)
- `NEXTAUTH_SECRET` - Secret for JWT signing

## Testing Data

Run `bun run db:seed` to populate database with test accounts:
- **Admin**: `admin` / `admin123`
- **Teacher**: `teacher` / `teacher123`
- **Student**: `student` / `student123`
- **Parent**: `parent` / `parent123`

## Important Notes

1. **Always await params** in dynamic routes (Next.js 15+)
2. **Never expose passwords** in API responses
3. **Always validate input** with Zod schemas
4. **Always check auth** before database operations
5. **Use role-based access control** consistently
6. **Use Prisma transactions** for multi-step operations
7. **Log errors** with `console.error` before returning 500

## Common Mistakes to Avoid

❌ Using semicolons (remove them)  
❌ Forgetting to await `params` in dynamic routes  
❌ Not checking authentication before database queries  
❌ Exposing passwords in select/include  
❌ Using `any` type without comment explaining why  
❌ Not handling Zod validation errors separately  
❌ Forgetting "use client" for components with state/hooks  
❌ Using single quotes instead of double quotes  

## Resources

- **Prisma Studio**: `bun run db:studio` - Visual database browser
- **API Testing**: Use tools like Postman/Insomnia, or `curl` commands
- **Type Safety**: Run `bun run db:generate` after schema changes
