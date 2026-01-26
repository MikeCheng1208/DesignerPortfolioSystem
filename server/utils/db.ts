import { Pool } from 'pg'

/**
 * PostgreSQL 連線池
 * 使用連線池可以提升效能，避免每次請求都建立新連線
 */

let pool: Pool | null = null

/**
 * 獲取資料庫連線池
 */
export function getDbPool(): Pool {
  if (!pool) {
    const config = useRuntimeConfig()

    // 優先使用 DATABASE_URL
    if (config.databaseUrl) {
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: {
          rejectUnauthorized: false // Zeabur 需要 SSL 連線
        }
      })
    } else {
      // 使用分開的連線參數
      pool = new Pool({
        user: config.dbUser,
        password: config.dbPassword,
        host: config.dbHost,
        port: parseInt(config.dbPort || '5432'),
        database: config.dbName,
        ssl: {
          rejectUnauthorized: false
        }
      })
    }

    // 連線池錯誤處理
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  return pool
}

/**
 * 執行資料庫查詢
 * @param text SQL 查詢語句
 * @param params 查詢參數
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getDbPool()
  const result = await pool.query(text, params)
  return result.rows
}

/**
 * 測試資料庫連線
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getDbPool()
    await pool.query('SELECT NOW()')
    console.log('✅ 資料庫連線成功')
    return true
  } catch (error) {
    console.error('❌ 資料庫連線失敗:', error)
    return false
  }
}

/**
 * 關閉資料庫連線池
 */
export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log('資料庫連線池已關閉')
  }
}
