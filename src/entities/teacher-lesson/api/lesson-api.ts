import { api } from '@/shared/api/instance'

import type {
  CreateLessonData,
  RotateSessionResponse,
  StartSessionResponse,
  TeacherLessonSchedule,
  UpdateStudentAttendanceData
} from '../model/types'

// Получаем занятия на выбранную дату.
export async function getTeacherLessons(
  date: string
): Promise<TeacherLessonSchedule[]> {
  const { data } = await api.get<TeacherLessonSchedule[]>(
    `/teacher/lessons?date=${encodeURIComponent(date)}`
  )

  return data
}

// Создаём конкретное занятие.
export async function createLesson(data: CreateLessonData) {
  const { data: result } = await api.post('/teacher/lessons/create', data)

  return result
}

// Запускаем QR-сессию.
export async function startAttendanceSession(
  lessonId: string
): Promise<StartSessionResponse> {
  const { data } = await api.post<StartSessionResponse>(
    `/teacher/lessons/${lessonId}/sessions`
  )

  return data
}

// Обновляем QR-токен.
export async function rotateAttendanceSession(
  sessionId: string
): Promise<RotateSessionResponse> {
  const { data } = await api.post<RotateSessionResponse>(
    `/teacher/sessions/${sessionId}/rotate`
  )

  return data
}

// Вручную изменяем посещаемость студента.
export async function updateStudentAttendance(
  lessonId: string,
  data: UpdateStudentAttendanceData
) {
  const { data: result } = await api.patch(
    `/teacher/lessons/${lessonId}/attendance`,
    data
  )

  return result
}
