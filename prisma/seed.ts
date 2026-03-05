import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nsms.com' },
    update: {},
    create: {
      email: 'admin@nsms.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✓ Created admin user')

  // Create subjects (sequential to avoid connection pool exhaustion)
  const mathematics = await prisma.subject.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: { name: 'Mathematics' },
  })
  
  const english = await prisma.subject.upsert({
    where: { name: 'English' },
    update: {},
    create: { name: 'English' },
  })
  
  const science = await prisma.subject.upsert({
    where: { name: 'Science' },
    update: {},
    create: { name: 'Science' },
  })
  
  const history = await prisma.subject.upsert({
    where: { name: 'History' },
    update: {},
    create: { name: 'History' },
  })
  
  const geography = await prisma.subject.upsert({
    where: { name: 'Geography' },
    update: {},
    create: { name: 'Geography' },
  })
  
  const subjects = [mathematics, english, science, history, geography]
  console.log('✓ Created subjects')

  // Create teacher user and profile
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.teacher.upsert({
    where: { teacherId: 'T001' },
    update: {},
    create: {
      teacherId: 'T001',
      name: 'John Smith',
      phone: '+1234567890',
      address: '123 Teacher St, City, State 12345',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      user: {
        create: {
          email: 'teacher@nsms.com',
          password: teacherPassword,
          role: 'TEACHER',
        },
      },
      subjects: {
        connect: [{ id: subjects[0].id }, { id: subjects[1].id }],
      },
    },
  })
  console.log('✓ Created teacher')

  // Create classes
  const class10A = await prisma.class.upsert({
    where: { name: '10A' },
    update: {},
    create: {
      name: '10A',
      capacity: 30,
      grade: 10,
      supervisorId: teacher.id,
    },
  })

  const class10B = await prisma.class.upsert({
    where: { name: '10B' },
    update: {},
    create: {
      name: '10B',
      capacity: 30,
      grade: 10,
    },
  })
  console.log('✓ Created classes')

  // Create student user and profile
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.student.upsert({
    where: { studentId: 'S001' },
    update: {},
    create: {
      studentId: 'S001',
      name: 'Jane Doe',
      phone: '+1234567891',
      address: '456 Student Ave, City, State 12345',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      grade: 10,
      class: {
        connect: { id: class10A.id },
      },
      user: {
        create: {
          email: 'student@nsms.com',
          password: studentPassword,
          role: 'STUDENT',
        },
      },
    },
  })
  console.log('✓ Created student')

  // Create parent user and profile
  const parentPassword = await bcrypt.hash('parent123', 10)
  const parent = await prisma.parent.upsert({
    where: { userId: student.userId },
    update: {},
    create: {
      name: 'Robert Doe',
      phone: '+1234567892',
      address: '456 Student Ave, City, State 12345',
      user: {
        create: {
          email: 'parent@nsms.com',
          password: parentPassword,
          role: 'PARENT',
        },
      },
      students: {
        connect: { id: student.id },
      },
    },
  })
  console.log('✓ Created parent')

  // Create lessons
  await prisma.lesson.create({
    data: {
      name: 'Math 101',
      day: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      subjectId: subjects[0].id,
      classId: class10A.id,
      teacherId: teacher.id,
    },
  })

  await prisma.lesson.create({
    data: {
      name: 'English Literature',
      day: 'TUESDAY',
      startTime: '10:00',
      endTime: '11:00',
      subjectId: subjects[1].id,
      classId: class10A.id,
      teacherId: teacher.id,
    },
  })
  console.log('✓ Created lessons')

  // Create exam
  const exam = await prisma.exam.create({
    data: {
      title: 'Mid-Term Mathematics Exam',
      date: new Date('2026-04-15'),
      startTime: '09:00',
      endTime: '11:00',
      subjectId: subjects[0].id,
      classId: class10A.id,
      teacherId: teacher.id,
    },
  })
  console.log('✓ Created exam')

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'English Essay: My Summer Vacation',
      dueDate: new Date('2026-03-20'),
      subjectId: subjects[1].id,
      classId: class10A.id,
      teacherId: teacher.id,
    },
  })
  console.log('✓ Created assignment')

  // Create results
  await prisma.result.create({
    data: {
      score: 85,
      type: 'EXAM',
      studentId: student.id,
      subjectId: subjects[0].id,
      teacherId: teacher.id,
      examId: exam.id,
    },
  })

  await prisma.result.create({
    data: {
      score: 92,
      type: 'ASSIGNMENT',
      studentId: student.id,
      subjectId: subjects[1].id,
      teacherId: teacher.id,
      assignmentId: assignment.id,
    },
  })
  console.log('✓ Created results')

  // Create events
  await prisma.event.create({
    data: {
      title: 'Science Fair',
      description: 'Annual school science fair',
      date: new Date('2026-04-01'),
      startTime: '10:00',
      endTime: '16:00',
      classId: class10A.id,
    },
  })

  await prisma.event.create({
    data: {
      title: 'Parent-Teacher Meeting',
      description: 'Quarterly parent-teacher meeting',
      date: new Date('2026-03-25'),
      startTime: '14:00',
      endTime: '17:00',
    },
  })
  console.log('✓ Created events')

  // Create announcements
  await prisma.announcement.create({
    data: {
      title: 'School Holiday Notice',
      description: 'School will be closed on March 15th for public holiday',
      date: new Date('2026-03-10'),
      classId: class10A.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'New Library Hours',
      description: 'The library will now be open until 6 PM on weekdays',
      date: new Date('2026-03-01'),
    },
  })
  console.log('✓ Created announcements')

  // Create attendance records
  const today = new Date()
  await prisma.attendance.create({
    data: {
      date: today,
      status: 'PRESENT',
      studentId: student.id,
    },
  })
  console.log('✓ Created attendance records')

  console.log('\n✅ Database seeded successfully!')
  console.log('\nDefault login credentials:')
  console.log('Admin: admin@nsms.com / admin123')
  console.log('Teacher: teacher@nsms.com / teacher123')
  console.log('Student: student@nsms.com / student123')
  console.log('Parent: parent@nsms.com / parent123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
