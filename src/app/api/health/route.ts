import { prisma } from '@/server/prisma'

export async function GET() {
  try {
    // Проверяем, отвечает ли PostgreSQL
    await prisma.$queryRaw`SELECT 1`

    return Response.json({
      status: 'ok',
      database: 'connected'
    })
  } catch {
    return Response.json(
      {
        status: 'error',
        database: 'disconnected'
      },
      { status: 500 }
    )
  }
}
