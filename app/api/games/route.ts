import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM games 
       ORDER BY published_at DESC 
       LIMIT 100`
    )

    return NextResponse.json(result.rows)

  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    )
  }
}