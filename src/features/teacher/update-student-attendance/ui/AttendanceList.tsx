'use client'

import type {
  AttendanceStatus,
  LessonAttendance,
  TeacherGroupStudent
} from '@/entities/teacher-lesson'

type AttendanceListProps = {
  lessonId: string
  lessonStatus: string
  students: TeacherGroupStudent[]
  attendance: LessonAttendance[]
  isPending: boolean
  pendingVariables?: {
    lessonId: string
    studentId: string
    present: boolean
  }
  onAttendanceChange: (
    lessonId: string,
    studentId: string,
    present: boolean
  ) => void
}

const attendanceLabels: Record<AttendanceStatus, string> = {
  PRESENT: 'Присутствует',
  LATE: 'Опоздал',
  EXCUSED: 'Уважительная причина',
  ABSENT: 'Отсутствует',
  UNMARKED: 'Не отмечен'
}

const attendanceStyles: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-success-bg text-success-text',
  LATE: 'bg-warning-bg text-warning-text',
  EXCUSED: 'bg-info-bg text-info-text',
  ABSENT: 'bg-danger-bg text-danger-text',
  UNMARKED: 'bg-muted-bg text-text-muted'
}

export function AttendanceList({
  lessonId,
  lessonStatus,
  students,
  attendance,
  isPending,
  pendingVariables,
  onAttendanceChange
}: AttendanceListProps) {
  const presentCount = students.filter(student =>
    attendance.some(
      record => record.studentId === student.id && record.status === 'PRESENT'
    )
  ).length

  const totalStudents = students.length

  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-heading">Посещаемость</h3>

        <span className="rounded-lg bg-success-bg px-3 py-1 text-sm font-medium text-success-text">
          Присутствуют: {presentCount} / {totalStudents}
        </span>
      </div>

      {totalStudents === 0 ? (
        <p className="text-sm text-text-muted">В группе пока нет студентов.</p>
      ) : (
        <div className="space-y-2">
          {students.map((student, index) => {
            const studentAttendance = attendance.find(
              record => record.studentId === student.id
            )

            const status: AttendanceStatus =
              studentAttendance?.status ?? 'UNMARKED'

            const isPresent = status === 'PRESENT'

            const isSaving =
              isPending &&
              pendingVariables?.lessonId === lessonId &&
              pendingVariables?.studentId === student.id

            const isDisabled = isSaving || lessonStatus === 'COMPLETED'

            return (
              <div
                key={student.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted-bg px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-sm text-text-muted">{index + 1}.</span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-heading">
                      {student.user.fullName}

                      {student.isHead && (
                        <span className="ml-2 text-xs font-medium text-primary">
                          Староста
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-text-muted">
                      № {student.studentNumber || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${attendanceStyles[status]}`}
                  >
                    {attendanceLabels[status]}
                  </span>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      disabled={isDisabled}
                      onChange={event =>
                        onAttendanceChange(
                          lessonId,
                          student.id,
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 cursor-pointer rounded accent-primary disabled:cursor-not-allowed"
                    />

                    <span className="text-text-muted">
                      {isSaving ? 'Сохранение...' : 'Пришёл'}
                    </span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
