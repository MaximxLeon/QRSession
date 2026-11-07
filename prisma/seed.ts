import 'dotenv/config'

import { hash } from 'bcryptjs'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const login = 'admin'
  const password = 'admin12345'

  const passwordHash = await hash(password, 12)

  await prisma.user.upsert({
    where: { login },
    update: {},
    create: {
      fullName: 'Администратор',
      login,
      passwordHash,
      role: 'ADMIN'
    }
  })

  console.log('Администратор создан')
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
