import 'dotenv/config'

import { hash } from 'bcryptjs'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient, Role } from '../../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Преподаватели из расписания
const teachers = [
  { fullName: 'Соснин Е.А.', login: 'teacher.sosnin.ea' },
  { fullName: 'Плотников А.А.', login: 'teacher.plotnikov.aa' },
  { fullName: 'Кравченко О.В.', login: 'teacher.kravchenko.ov' },
  { fullName: 'Егоров М.Ф.', login: 'teacher.egorov.mf' },
  { fullName: 'Ильина Н.А.', login: 'teacher.ilina.na' },
  { fullName: 'Дорофеев И.В.', login: 'teacher.dorofeev.iv' },
  { fullName: 'Усова Н.Н.', login: 'teacher.usova.nn' },
  { fullName: 'Малышева Н.В.', login: 'teacher.malysheva.nv' },
  { fullName: 'Кулагин Д.А.', login: 'teacher.kulagin.da' },
  { fullName: 'Ремизов Е.И.', login: 'teacher.remizov.ei' },
  { fullName: 'Лапина А.В.', login: 'teacher.lapina.av' },
  { fullName: 'Щербаков О.С.', login: 'teacher.shcherbakov.os' },
  { fullName: 'Провоторов С.Н.', login: 'teacher.provotorov.sn' },
  { fullName: 'Гринёва М.С.', login: 'teacher.grineva.ms' },
  { fullName: 'Астахов Р.В.', login: 'teacher.astakhov.rv' },
  { fullName: 'Медведева Т.Л.', login: 'teacher.medvedeva.tl' }
]

// Предметы из расписания
const subjects = [
  'Теоретическая информатика',
  'История России',
  'Математика. Линейная алгебра',
  'Основы программирования',
  'Введение в учебную и исследовательскую деятельность',
  'Основы проектной деятельности',
  'Концепции современного естествознания',
  'Иностранный язык',
  'Основы командной работы',
  'Общая и прикладная физическая подготовка',
  'Базы данных',
  'Дискретная математика',
  'Компьютерные сети',
  'Веб-разработка'
]

async function main() {
  const passwordHash = await hash('teacher12345', 10)

  // Создание преподавателей
  for (const teacher of teachers) {
    await prisma.user.upsert({
      where: {
        login: teacher.login
      },
      update: {
        fullName: teacher.fullName,
        role: Role.TEACHER,
        isActive: true
      },
      create: {
        fullName: teacher.fullName,
        login: teacher.login,
        passwordHash,
        role: Role.TEACHER,
        isActive: true
      }
    })
  }

  // Создание предметов
  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  console.log('Преподаватели и предметы успешно созданы!')
  console.log(`Преподавателей: ${teachers.length}`)
  console.log(`Предметов: ${subjects.length}`)
  console.log('Временный пароль преподавателей: teacher12345')
}

main()
  .catch(error => {
    console.error('Ошибка при заполнении базы:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
