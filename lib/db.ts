// require('dotenv').config();

// import { Pool } from 'pg';
// import type { QueryResult } from 'pg';

// // Type for expected database error
// interface DatabaseError extends Error {
//   code?: string;
//   detail?: string;
//   hint?: string;
// }

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { 
//     rejectUnauthorized: false 
//   } : false,
// });

// async function initializeDatabase(retries = 3, delay = 1000): Promise<void> {
//   try {
//     const result: QueryResult = await pool.query(`
//       CREATE TABLE IF NOT EXISTS games (
//         id SERIAL PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         game_url VARCHAR(255) NOT NULL,
//         image_url VARCHAR(255) DEFAULT '/images/default-game.png',
//         category VARCHAR(50) DEFAULT 'arcade',
//         published_at TIMESTAMP DEFAULT NOW(),
//         likes INTEGER DEFAULT 0,
//         plays INTEGER DEFAULT 0,
//         author_id VARCHAR(100),
//         author_name VARCHAR(100),
//         CONSTRAINT unique_game_url UNIQUE (game_url)
//       );
      
//       CREATE INDEX IF NOT EXISTS games_category_idx ON games(category);
//       CREATE INDEX IF NOT EXISTS games_published_at_idx ON games(published_at);
//     `);
//     console.log('✅ Database initialized successfully');
//   } catch (error: unknown) {
//     // Type guard to check if it's an Error
//     if (error instanceof Error) {
//       const dbError = error as DatabaseError;
//       console.error('❌ Database initialization error:', {
//         message: dbError.message,
//         code: dbError.code,
//         stack: dbError.stack
//       });
//     } else {
//       console.error('❌ Unknown database initialization error:', error);
//     }
    
//     if (retries > 0) {
//       console.log(`Retrying... (${retries} attempts remaining)`);
//       await new Promise(res => setTimeout(res, delay));
//       await initializeDatabase(retries - 1, delay * 2);
//     }
//   }
// }

// // Initialize only if not in production build phase
// if (process.env.NODE_ENV !== 'production' || process.env.IS_BUILD !== 'true') {
//   initializeDatabase().catch(e => console.error('Initialization failed:', e));
// }

// process.on('exit', () => {
//   pool.end().catch(e => console.error('Error closing pool:', e));
// });

// export { pool };

//lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export { pool };
