import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT 1+1 AS test')

    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'games'
      )
    `)

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      tables: {
        games: tableCheck.rows[0]?.exists || false
      },
      testResult: result.rows[0]?.test
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json(
      {
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
