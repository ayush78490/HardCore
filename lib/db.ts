import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Create games table if not exists
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        game_url VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) DEFAULT '/images/default-game.png',
        category VARCHAR(50) DEFAULT 'arcade',
        published_at TIMESTAMP DEFAULT NOW(),
        likes INTEGER DEFAULT 0,
        plays INTEGER DEFAULT 0,
        author_id VARCHAR(100),
        author_name VARCHAR(100)
      );
    `)
    console.log('Database initialized')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

initializeDatabase()

export { pool }