import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

type AttendanceStats = {
  total: number
  attended: number
  absent: number
  late: number
  excused: number
  lessonIds: Set<string>
  studentIds: Set<string>
}

function createStats(): AttendanceStats {
  return {
    total: 0,
    attended: 0,
    absent: 0,
    late: 0,
    excused: 0,
    lessonIds: new Set(),
    studentIds: new Set()
  }
}

function addAttendance(
  stats: AttendanceStats,
  lessonId: string,
  studentId: string,
  status: string
) {
  stats.total += 1
  stats.lessonIds.add(lessonId)
  stats.studentIds.add(studentId)

  switch (status) {
    case 'PRESENT':
      stats.attended += 1
      break

    case 'LATE':
      stats.attended += 1
      stats.late += 1
      break

    case 'EXCUSED':
      stats.excused += 1
      break

    case 'ABSENT':
    case 'UNMARKED':
    default:
      stats.absent += 1
      break
  }
}

function getRate(stats: AttendanceStats) {
  if (!stats.total) return 0

  return Math.round((stats.attended / stats.total) * 1000) / 10
}

function serializeStats(stats: AttendanceStats) {
  return {
    total: stats.total,
    attended: stats.attended,
    absent: stats.absent,
    late: stats.late,
    excused: stats.excused,
    lessonsCount: stats.lessonIds.size,
    studentsCount: stats.studentIds.size,
    rate: getRate(stats)
  }
}

// Проверяем формат даты YYYY-MM-DD.
function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime())) return null

  if (date.toISOString().slice(0, 10) !== value) {
    return null
  }

  return date
}

const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export async function GET(request: NextRequest) {
  try {
    // Проверяем права администратора.
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
    }

    const params = request.nextUrl.searchParams

    // По умолчанию берём текущий месяц.
    const now = new Date()

    const defaultFrom = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    )

    const defaultTo = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )

    const fromValue = params.get('from')
    const toValue = params.get('to')
    const thresholdValue = params.get('threshold')

    const from = fromValue ? parseDate(fromValue) : defaultFrom

    const to = toValue ? parseDate(toValue) : defaultTo

    if (!from || !to || from > to) {
      return NextResponse.json(
        { message: 'Некорректный период аналитики' },
        { status: 400 }
      )
    }

    // Порог применяется к спискам студентов.
    let threshold: number | null = null

    if (thresholdValue && thresholdValue !== 'all') {
      threshold = Number(thresholdValue)

      if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
        return NextResponse.json(
          { message: 'Некорректный порог посещаемости' },
          { status: 400 }
        )
      }
    }

    const debug = await prisma.lesson.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    console.log('Статистика занятий по статусам:', debug)

    const latestLessons = await prisma.lesson.findMany({
      take: 10,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        date: true,
        status: true,
        schedule: {
          select: {
            group: {
              select: {
                name: true
              }
            },
            subject: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    console.log('Последние занятия:', latestLessons)

    // Загружаем только проведённые занятия.
    const lessons = await prisma.lesson.findMany({
      where: {
        date: {
          gte: from,
          lte: to
        },
        status: 'COMPLETED'
      },
      include: {
        schedule: {
          include: {
            group: true,
            subject: true,
            teacher: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        attendance: {
          select: {
            studentId: true,
            status: true,
            source: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    const groupIds = [
      ...new Set(lessons.map(lesson => lesson.schedule.groupId))
    ]

    // Получаем активных студентов соответствующих групп.
    const groups = await prisma.group.findMany({
      where: {
        id: {
          in: groupIds
        }
      },
      include: {
        students: {
          where: {
            user: {
              isActive: true
            }
          },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                login: true
              }
            }
          }
        }
      }
    })

    const groupsMap = new Map(groups.map(group => [group.id, group]))

    // Общие счётчики.
    const groupStats = new Map<string, AttendanceStats>()
    const subjectStats = new Map<string, AttendanceStats>()
    const teacherStats = new Map<string, AttendanceStats>()

    // Предмет -> группа.
    const subjectGroupStats = new Map<string, AttendanceStats>()

    // Предмет -> студент.
    const subjectStudentStats = new Map<string, AttendanceStats>()

    // Преподаватель -> группа.
    const teacherGroupStats = new Map<string, AttendanceStats>()

    // Преподаватель -> предмет.
    const teacherSubjectStats = new Map<string, AttendanceStats>()

    // Студент по всем предметам.
    const studentStats = new Map<string, AttendanceStats>()

    // Дополнительная информация о студентах.
    const studentsInfo = new Map<
      string,
      {
        id: string
        fullName: string
        login: string
        studentNumber: string | null
        groupId: string
        groupName: string
      }
    >()

    // День недели.
    const weekdayStats = new Map<number, AttendanceStats>()

    // Время начала занятия.
    const timeStats = new Map<string, AttendanceStats>()

    // Детализация занятий.
    const lessonDetails: Array<{
      id: string
      date: string
      startsAt: string
      endsAt: string
      classroom: string
      subjectId: string
      subjectName: string
      groupId: string
      groupName: string
      teacherId: string
      teacherName: string
      attended: number
      absent: number
      late: number
      excused: number
      total: number
      rate: number
    }> = []

    // Обрабатываем каждое проведённое занятие.
    for (const lesson of lessons) {
      const schedule = lesson.schedule
      const group = groupsMap.get(schedule.groupId)

      if (!group) continue

      const lessonAttendance = new Map(
        lesson.attendance.map(item => [item.studentId, item.status])
      )

      const groupKey = schedule.groupId
      const subjectKey = schedule.subjectId
      const teacherKey = schedule.teacherId

      const subjectGroupKey = `${subjectKey}:${groupKey}`
      const teacherGroupKey = `${teacherKey}:${groupKey}`
      const teacherSubjectKey = `${teacherKey}:${subjectKey}`

      if (!groupStats.has(groupKey)) {
        groupStats.set(groupKey, createStats())
      }

      if (!subjectStats.has(subjectKey)) {
        subjectStats.set(subjectKey, createStats())
      }

      if (!teacherStats.has(teacherKey)) {
        teacherStats.set(teacherKey, createStats())
      }

      if (!subjectGroupStats.has(subjectGroupKey)) {
        subjectGroupStats.set(subjectGroupKey, createStats())
      }

      if (!teacherGroupStats.has(teacherGroupKey)) {
        teacherGroupStats.set(teacherGroupKey, createStats())
      }

      if (!teacherSubjectStats.has(teacherSubjectKey)) {
        teacherSubjectStats.set(teacherSubjectKey, createStats())
      }

      const currentLessonStats = createStats()

      for (const profile of group.students) {
        const studentId = profile.id
        const status = lessonAttendance.get(studentId) ?? 'ABSENT'

        studentsInfo.set(studentId, {
          id: studentId,
          fullName: profile.user.fullName,
          login: profile.user.login,
          studentNumber: profile.studentNumber,
          groupId: group.id,
          groupName: group.name
        })

        if (!studentStats.has(studentId)) {
          studentStats.set(studentId, createStats())
        }

        const subjectStudentKey = `${subjectKey}:${studentId}`

        if (!subjectStudentStats.has(subjectStudentKey)) {
          subjectStudentStats.set(subjectStudentKey, createStats())
        }

        addAttendance(groupStats.get(groupKey)!, lesson.id, studentId, status)

        addAttendance(
          subjectStats.get(subjectKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          teacherStats.get(teacherKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          subjectGroupStats.get(subjectGroupKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          teacherGroupStats.get(teacherGroupKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          teacherSubjectStats.get(teacherSubjectKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          studentStats.get(studentId)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(
          subjectStudentStats.get(subjectStudentKey)!,
          lesson.id,
          studentId,
          status
        )

        addAttendance(currentLessonStats, lesson.id, studentId, status)
      }

      // Статистика по дням недели.
      const weekday = lesson.date.getUTCDay()

      if (!weekdayStats.has(weekday)) {
        weekdayStats.set(weekday, createStats())
      }

      addAttendance(weekdayStats.get(weekday)!, lesson.id, group.id, 'PRESENT')

      // Для времени используем шаблон расписания.
      const time = schedule.startTime

      if (!timeStats.has(time)) {
        timeStats.set(time, createStats())
      }

      for (const profile of group.students) {
        const status = lessonAttendance.get(profile.id) ?? 'ABSENT'

        addAttendance(timeStats.get(time)!, lesson.id, profile.id, status)
      }

      lessonDetails.push({
        id: lesson.id,
        date: lesson.date.toISOString().slice(0, 10),
        startsAt: lesson.startsAt.toISOString(),
        endsAt: lesson.endsAt.toISOString(),
        classroom: lesson.classroom,
        subjectId: schedule.subject.id,
        subjectName: schedule.subject.name,
        groupId: group.id,
        groupName: group.name,
        teacherId: schedule.teacher.id,
        teacherName: schedule.teacher.fullName,
        attended: currentLessonStats.attended,
        absent: currentLessonStats.absent,
        late: currentLessonStats.late,
        excused: currentLessonStats.excused,
        total: currentLessonStats.total,
        rate: getRate(currentLessonStats)
      })
    }

    // Список студентов с общей посещаемостью.
    const allStudents = [...studentStats.entries()].map(
      ([studentId, stats]) => {
        const info = studentsInfo.get(studentId)!

        return {
          ...info,
          ...serializeStats(stats)
        }
      }
    )

    // Сортировка от самой низкой посещаемости.
    allStudents.sort((a, b) => a.rate - b.rate)

    const lowAttendanceStudents = allStudents.filter(
      student =>
        threshold !== null && student.total > 0 && student.rate < threshold
    )

    // Предметы и сравнение групп внутри каждого предмета.
    const subjectMap = new Map(
      lessons.map(lesson => [
        lesson.schedule.subject.id,
        lesson.schedule.subject
      ])
    )

    const bySubject = [...subjectMap.values()].map(subject => ({
      subjectId: subject.id,
      subjectName: subject.name,
      ...serializeStats(subjectStats.get(subject.id)!),
      groups: groups
        .filter(group => subjectGroupStats.has(`${subject.id}:${group.id}`))
        .map(group => ({
          groupId: group.id,
          groupName: group.name,
          ...serializeStats(subjectGroupStats.get(`${subject.id}:${group.id}`)!)
        }))
        .sort((a, b) => a.rate - b.rate),
      students: allStudents
        .filter(student =>
          subjectStudentStats.has(`${subject.id}:${student.id}`)
        )
        .map(student => ({
          ...student,
          ...serializeStats(
            subjectStudentStats.get(`${subject.id}:${student.id}`)!
          )
        }))
        .filter(student => threshold === null || student.rate < threshold)
        .sort((a, b) => a.rate - b.rate)
    }))

    bySubject.sort((a, b) => a.rate - b.rate)

    // Группы.
    const byGroup = groups
      .filter(group => groupStats.has(group.id))
      .map(group => ({
        groupId: group.id,
        groupName: group.name,
        ...serializeStats(groupStats.get(group.id)!)
      }))
      .sort((a, b) => a.rate - b.rate)

    // Преподаватели.
    const teacherMap = new Map(
      lessons.map(lesson => [
        lesson.schedule.teacher.id,
        lesson.schedule.teacher
      ])
    )

    const byTeacher = [...teacherMap.values()].map(teacher => ({
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      ...serializeStats(teacherStats.get(teacher.id)!),

      groups: byGroup
        .filter(group =>
          teacherGroupStats.has(`${teacher.id}:${group.groupId}`)
        )
        .map(group => ({
          groupId: group.groupId,
          groupName: group.groupName,
          ...serializeStats(
            teacherGroupStats.get(`${teacher.id}:${group.groupId}`)!
          )
        })),

      subjects: [...subjectMap.values()]
        .filter(subject =>
          teacherSubjectStats.has(`${teacher.id}:${subject.id}`)
        )
        .map(subject => ({
          subjectId: subject.id,
          subjectName: subject.name,
          ...serializeStats(
            teacherSubjectStats.get(`${teacher.id}:${subject.id}`)!
          )
        }))
    }))

    byTeacher.sort((a, b) => a.rate - b.rate)

    // Статистика по дням недели.
    const byWeekday = weekdays.map((day, index) => {
      const stats = weekdayStats.get(index) ?? createStats()

      return {
        day,
        ...serializeStats(stats)
      }
    })

    // Статистика по времени начала занятий.
    const byTime = [...timeStats.entries()]
      .map(([time, stats]) => ({
        time,
        ...serializeStats(stats)
      }))
      .sort((a, b) => a.time.localeCompare(b.time))

    // Общая статистика.
    const totalStats = createStats()

    for (const stats of groupStats.values()) {
      totalStats.total += stats.total
      totalStats.attended += stats.attended
      totalStats.absent += stats.absent
      totalStats.late += stats.late
      totalStats.excused += stats.excused
    }

    const [totalStudents, totalGroups, totalTeachers, totalSubjects] =
      await Promise.all([
        prisma.studentProfile.count({
          where: {
            user: { isActive: true }
          }
        }),
        prisma.group.count(),
        prisma.user.count({
          where: {
            role: 'TEACHER',
            isActive: true
          }
        }),
        prisma.subject.count()
      ])

    return NextResponse.json({
      filters: {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
        threshold
      },

      summary: {
        totalStudents,
        totalGroups,
        totalTeachers,
        totalSubjects,
        completedLessons: lessons.length,
        ...serializeStats(totalStats)
      },

      byGroup,
      bySubject,
      byTeacher,

      students: allStudents,
      lowAttendanceStudents,

      byWeekday,
      byTime,

      lessons: lessonDetails
    })
  } catch (error) {
    console.error('Ошибка аналитики администратора:', error)

    return NextResponse.json(
      { message: 'Не удалось загрузить аналитику' },
      { status: 500 }
    )
  }
}
