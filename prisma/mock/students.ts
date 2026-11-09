/**
 * Импорт тестового набора студентов students_526_mock.
 *
 * Запуск из корня проекта:
 *   npx tsx prisma/seed-students.ts
 *
 * Для всех импортируемых студентов устанавливается временный пароль:
 *   student12345
 *
 * Логин = student_id (например, STU-5001).
 * student_id сохраняется в StudentProfile.studentNumber.
 */

import 'dotenv/config'

import { hash } from 'bcryptjs'

import { PrismaPg } from '@prisma/adapter-pg'

import { Gender, PrismaClient, Role } from '../../src/generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter })

const INITIAL_PASSWORD = 'student12345'

type StudentImportRow = {
  studentNumber: string
  fullName: string
  gender: Gender
  groupName: string
  isHead: boolean
}

const students: StudentImportRow[] = [
  // Группа 526-1
  {
    studentNumber: 'STU-5001',
    fullName: 'Смирнов Артём Олегович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5002',
    fullName: 'Иванов Даниил Сергеевич',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5003',
    fullName: 'Петров Кирилл Андреевич',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5004',
    fullName: 'Волков Максим Дмитриевич',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5005',
    fullName: 'Соколов Егор Иванович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5006',
    fullName: 'Морозов Никита Алексеевич',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5007',
    fullName: 'Фёдоров Артём Викторович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5008',
    fullName: 'Михайлов Денис Павлович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5009',
    fullName: 'Алексеев Илья Сергеевич',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5010',
    fullName: 'Лебедев Тимур Романович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5011',
    fullName: 'Орлов Владислав Олегович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5012',
    fullName: 'Зайцев Роман Александрович',
    gender: Gender.MALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5013',
    fullName: 'Павлова Мария Николаевна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: true
  },
  {
    studentNumber: 'STU-5014',
    fullName: 'Козлова Анна Дмитриевна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5015',
    fullName: 'Соловьёва Ольга Игоревна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5016',
    fullName: 'Васильева Екатерина Андреевна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5017',
    fullName: 'Захарова Дарья Максимовна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5018',
    fullName: 'Богданова Полина Сергеевна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5019',
    fullName: 'Гусева Алиса Викторовна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5020',
    fullName: 'Егорова Ксения Павловна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5021',
    fullName: 'Жукова Валерия Дмитриевна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5022',
    fullName: 'Ильина Софья Романовна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5023',
    fullName: 'Ковалёва Анастасия Ильинична',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5024',
    fullName: 'Крылова Марина Олеговна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },
  {
    studentNumber: 'STU-5025',
    fullName: 'Максимова Юлия Александровна',
    gender: Gender.FEMALE,
    groupName: '526-1',
    isHead: false
  },

  // Группа 526-2
  {
    studentNumber: 'STU-5026',
    fullName: 'Белов Григорий Степанович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5027',
    fullName: 'Тихонов Арсений Львович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5028',
    fullName: 'Комаров Елизар Матвеевич',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5029',
    fullName: 'Гаврилов Захар Артурович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5030',
    fullName: 'Рогов Марк Валентинович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5031',
    fullName: 'Дроздов Лев Константинович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5032',
    fullName: 'Ершов Ярослав Дмитриевич',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5033',
    fullName: 'Игнатов Пётр Всеволодович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5034',
    fullName: 'Клюев Тарас Игоревич',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5035',
    fullName: 'Мальцев Данила Олегович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5036',
    fullName: 'Носов Всеволод Павлович',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5037',
    fullName: 'Панкратов Степан Григорьевич',
    gender: Gender.MALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5038',
    fullName: 'Новикова Маргарита Олеговна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: true
  },
  {
    studentNumber: 'STU-5039',
    fullName: 'Полякова Виктория Сергеевна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5040',
    fullName: 'Родионова Кира Антоновна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5041',
    fullName: 'Селезнёва Ульяна Михайловна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5042',
    fullName: 'Тарасова Ева Дмитриевна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5043',
    fullName: 'Устинова Лада Аркадьевна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5044',
    fullName: 'Филатова Милана Артёмовна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5045',
    fullName: 'Хромова Стелла Игоревна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5046',
    fullName: 'Царёва Есения Павловна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5047',
    fullName: 'Шевелёва Диана Романовна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5048',
    fullName: 'Щербакова Виолетта Марковна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },
  {
    studentNumber: 'STU-5049',
    fullName: 'Абрамова Татьяна Львовна',
    gender: Gender.FEMALE,
    groupName: '526-2',
    isHead: false
  },

  // Группа 526-3
  {
    studentNumber: 'STU-5050',
    fullName: 'Харитонов Глеб Сергеевич',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5051',
    fullName: 'Черных Мирослав Игоревич',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5052',
    fullName: 'Юдин Савелий Олегович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5053',
    fullName: 'Яковлев Артур Викторович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5054',
    fullName: 'Крылов Матвей Ильич',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5055',
    fullName: 'Сазонов Родион Павлович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5056',
    fullName: 'Зуев Арий Дмитриевич',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5057',
    fullName: 'Шаров Кирилл Максимович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5058',
    fullName: 'Быков Никита Романович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5059',
    fullName: 'Титов Всеволод Аркадьевич',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5060',
    fullName: 'Кузьмин Виктор Максимович',
    gender: Gender.MALE,
    groupName: '526-3',
    isHead: true
  },
  {
    studentNumber: 'STU-5061',
    fullName: 'Орехова Лидия Валентиновна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5062',
    fullName: 'Некрасова Злата Артёмовна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5063',
    fullName: 'Александрова Вера Михайловна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5064',
    fullName: 'Дмитриева Нина Георгиевна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5065',
    fullName: 'Семёнова Регина Тимуровна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5066',
    fullName: 'Фомина Лариса Константиновна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5067',
    fullName: 'Громова Инга Руслановна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5068',
    fullName: 'Дроздова Агата Петровна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5069',
    fullName: 'Тимофеева Лия Егоровна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5070',
    fullName: 'Сафина Аделия Ринатовна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5071',
    fullName: 'Осипова Инна Витальевна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  },
  {
    studentNumber: 'STU-5072',
    fullName: 'Белозёрова Тамара Юрьевна',
    gender: Gender.FEMALE,
    groupName: '526-3',
    isHead: false
  }
]

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Не задан DATABASE_URL в .env')
  }

  if (students.length !== 72) {
    throw new Error(`Ожидалось 72 студента, получено: ${students.length}`)
  }

  const passwordHash = await hash(INITIAL_PASSWORD, 12)

  // Создаём группы, если их ещё нет.
  const groupNames = [...new Set(students.map(student => student.groupName))]

  const groups = await Promise.all(
    groupNames.map(name =>
      prisma.group.upsert({
        where: { name },
        create: { name },
        update: {}
      })
    )
  )

  const groupIdByName = new Map(groups.map(group => [group.name, group.id]))

  let created = 0
  let updated = 0

  for (const student of students) {
    const groupId = groupIdByName.get(student.groupName)

    if (!groupId) {
      throw new Error(`Не найдена группа ${student.groupName}`)
    }

    // Логин делаем равным идентификатору из исходного набора.
    const existingUser = await prisma.user.findUnique({
      where: { login: student.studentNumber },
      select: { id: true }
    })

    const user = await prisma.user.upsert({
      where: { login: student.studentNumber },
      create: {
        login: student.studentNumber,
        fullName: student.fullName,
        passwordHash,
        role: Role.STUDENT,
        gender: student.gender,
        isActive: true,
        studentProfile: {
          create: {
            groupId,
            studentNumber: student.studentNumber,
            isHead: student.isHead
          }
        }
      },
      update: {
        fullName: student.fullName,
        gender: student.gender,
        role: Role.STUDENT,
        isActive: true
      }
    })

    // Отдельный upsert нужен на случай, если User уже существовал,
    // но профиль студента ещё не был создан.
    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        groupId,
        studentNumber: student.studentNumber,
        isHead: student.isHead
      },
      update: {
        groupId,
        studentNumber: student.studentNumber,
        isHead: student.isHead
      }
    })

    if (existingUser) updated++
    else created++
  }

  console.log('Импорт завершён успешно.')
  console.log(`Групп: ${groups.length}`)
  console.log(`Студентов в наборе: ${students.length}`)
  console.log(`Создано пользователей: ${created}`)
  console.log(`Обновлено пользователей: ${updated}`)
  console.log(`Логин каждого студента: STU-xxxx`)
  console.log(`Временный пароль: ${INITIAL_PASSWORD}`)
}

main()
  .catch(error => {
    console.error('Ошибка импорта студентов:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
