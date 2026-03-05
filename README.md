# Next School Management System (NSMS)

A modern, full-featured school management system built with Next.js 16, React 19, TypeScript, Prisma, and PostgreSQL.

## Features

### Current Features
- **Role-Based Access Control**: Admin, Teacher, Student, and Parent roles with different permissions
- **Authentication**: Secure authentication with NextAuth.js v5 and bcrypt password hashing
- **Dashboard Views**: Customized dashboards for each role
- **User Management**: CRUD operations for Teachers, Students, Parents
- **Academic Management**: Classes, Subjects, Lessons, Exams, Assignments
- **Results Tracking**: Grade and performance tracking
- **Calendar & Events**: School calendar with events and announcements
- **Attendance System**: Track student attendance
- **Modern UI**: Built with Tailwind CSS 4 and shadcn/ui components
- **Responsive Design**: Mobile-first approach

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Icons**: Lucide React
- **Components**: shadcn/ui (Radix UI primitives)

## Getting Started

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nsms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials:
   ```env
   # Database - PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/nsms?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   ```

   **To generate a secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**

   Push the Prisma schema to your database:
   ```bash
   npm run db:push
   ```

   Or run migrations (recommended for production):
   ```bash
   npm run db:migrate
   ```

5. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

6. **Seed the database** (optional - creates sample data)
   ```bash
   npm run db:seed
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup Options

### Option 1: Local PostgreSQL
Install PostgreSQL locally and create a database:
```bash
createdb nsms
```

### Option 2: Cloud PostgreSQL (Recommended)
Use a free PostgreSQL hosting service:

- **Neon** (https://neon.tech) - Recommended, generous free tier
- **Supabase** (https://supabase.com) - Includes auth and storage
- **Railway** (https://railway.app) - Easy deployment
- **Vercel Postgres** (https://vercel.com/storage/postgres) - Serverless

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database scripts
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database (development)
npm run db:migrate   # Run migrations (production)
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```

## Project Structure

```
nsms/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── teacher/       # Teacher dashboard
│   │   │   ├── student/       # Student dashboard
│   │   │   ├── parent/        # Parent dashboard
│   │   │   ├── list/          # CRUD pages
│   │   │   └── signin/        # Sign-in page
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   └── teachers/      # Teacher API
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   └── Forms/             # Form components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Route protection
├── .env                       # Environment variables (git-ignored)
├── .env.example               # Environment template
├── components.json            # shadcn/ui config
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Teachers
- `GET /api/teachers` - List all teachers (with pagination & search)
- `POST /api/teachers` - Create a new teacher (admin only)
- `GET /api/teachers/[id]` - Get single teacher
- `PATCH /api/teachers/[id]` - Update teacher (admin only)
- `DELETE /api/teachers/[id]` - Delete teacher (admin only)

*Similar API routes will be created for Students, Parents, Classes, Subjects, etc.*

## Database Schema

### Core Models
- **User** - Authentication and base user data
- **Teacher** - Teacher profile and relations
- **Student** - Student profile and class assignment
- **Parent** - Parent profile linked to students
- **Class** - Class/grade with capacity and supervisor
- **Subject** - Academic subjects
- **Lesson** - Class schedules with day/time
- **Exam** - Exam details with date and class
- **Assignment** - Homework/assignments
- **Result** - Grades for exams and assignments
- **Event** - School events
- **Announcement** - School announcements
- **Attendance** - Student attendance tracking

## Authentication & Authorization

### Roles
1. **ADMIN** - Full system access, CRUD on all entities
2. **TEACHER** - View classes, students, create exams/assignments, enter grades
3. **STUDENT** - View own schedule, grades, assignments
4. **PARENT** - View linked students' data

### Default Credentials (after seeding)
```
Admin:
Email: admin@nsms.com
Password: admin123

Teacher:
Email: teacher@nsms.com
Password: teacher123

Student:
Email: student@nsms.com
Password: student123

Parent:
Email: parent@nsms.com
Password: parent123
```

## Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes to the code**

3. **Update database schema** (if needed)
   - Edit `prisma/schema.prisma`
   - Run `npm run db:migrate` to create migration
   - Or `npm run db:push` for quick prototyping

4. **Test your changes**
   ```bash
   npm run dev
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature-name
   ```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database
- Use Neon, Supabase, or Vercel Postgres for production database
- Update `DATABASE_URL` in Vercel environment variables

## Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Database setup with Prisma
- [x] Authentication with NextAuth.js
- [x] Environment configuration
- [x] API routes architecture

### Phase 2: Feature Completion
- [ ] Complete all CRUD operations for all entities
- [ ] Form validations with Zod
- [ ] Search, filter, and pagination
- [ ] File uploads for photos/documents
- [ ] Real-time notifications

### Phase 3: Quality & Reliability
- [ ] Error handling & boundaries
- [ ] Testing setup (Vitest + Playwright)
- [ ] Performance optimization
- [ ] Security hardening

### Phase 4: Enhanced Features
- [ ] Advanced role permissions
- [ ] Email notifications
- [ ] Reports & analytics
- [ ] Attendance tracking dashboard
- [ ] Grade book system
- [ ] Parent-teacher messaging
- [ ] PDF report generation
- [ ] Data export functionality

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
