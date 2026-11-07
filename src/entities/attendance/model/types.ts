export type ScanAttendanceData = {
  sessionId: string
  token: string
  confirmationCode: string
}

export type ScanAttendanceResponse = {
  message: string
  attendance: {
    id: string
    status: string
    markedAt: string
  }
}
