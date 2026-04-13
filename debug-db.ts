import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const studentEmail = 'kmlalpp@gmail.com' // From previous logs
  const student = await prisma.profile.findUnique({ where: { email: studentEmail } })
  
  if (!student) {
    console.log('Student not found')
    return
  }

  const assignments = await prisma.assignment.findMany({
    where: { studentId: student.id }
  })

  console.log(`Student ID: ${student.id}`)
  console.log(`Assignments Count: ${assignments.length}`)
  console.log('Last 3 assignments:', JSON.stringify(assignments.slice(0, 3), null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
