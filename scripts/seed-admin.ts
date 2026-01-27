#!/usr/bin/env node
/**
 * Admin 使用者種子腳本
 * 用於建立初始的 admin 帳號
 *
 * 使用方式:
 *   npm run seed:admin
 *
 * 環境變數:
 *   ADMIN_USERNAME - 管理員帳號 (預設: admin)
 *   ADMIN_EMAIL - 管理員 Email (預設: admin@example.com)
 *   ADMIN_PASSWORD - 管理員密碼 (預設: 互動式輸入)
 *   ADMIN_DISPLAY_NAME - 顯示名稱 (預設: 系統管理員)
 */

import 'dotenv/config'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import * as readline from 'readline'

// 從環境變數或使用預設值
const MONGODB_URI = process.env.MONGODB_URI || ''
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || '系統管理員'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const SALT_ROUNDS = 10

interface AdminUserDocument {
  username: string
  email: string
  passwordHash: string
  displayName: string
  role: 'super_admin'
  permissions: string[]
  isActive: boolean
  loginAttempts: number
  createdAt: Date
  updatedAt: Date
}

/**
 * 從終端機讀取密碼（隱藏輸入）
 */
function readPassword(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // 隱藏輸入
    const stdin = process.stdin as any
    stdin.setRawMode?.(true)

    let password = ''

    process.stdout.write(prompt)

    stdin.on('data', (char: Buffer) => {
      const str = char.toString('utf8')

      switch (str) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          stdin.setRawMode?.(false)
          rl.close()
          process.stdout.write('\n')
          resolve(password)
          break
        case '\u0003': // Ctrl+C
          process.exit()
          break
        case '\u007f': // Backspace
          password = password.slice(0, -1)
          process.stdout.clearLine(0)
          process.stdout.cursorTo(0)
          process.stdout.write(prompt + '*'.repeat(password.length))
          break
        default:
          password += str
          process.stdout.write('*')
          break
      }
    })
  })
}

/**
 * 驗證密碼強度
 */
function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: '密碼長度至少需要 8 個字元' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個小寫字母' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個大寫字母' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個數字' }
  }

  return { valid: true }
}

/**
 * 主要執行函數
 */
async function seedAdmin() {
  console.log('========================================')
  console.log('   Admin 使用者種子腳本')
  console.log('========================================\n')

  // 檢查 MongoDB URI
  if (!MONGODB_URI) {
    console.error('❌ 錯誤: 未設定 MONGODB_URI 環境變數')
    console.error('請在 .env 檔案中設定資料庫連線資訊')
    process.exit(1)
  }

  // 取得或輸入密碼
  let password = ADMIN_PASSWORD

  if (!password) {
    console.log('請設定管理員密碼（至少 8 字元，包含大小寫字母和數字）\n')

    while (true) {
      password = await readPassword('請輸入密碼: ')

      const validation = validatePassword(password)
      if (!validation.valid) {
        console.log(`❌ ${validation.message}\n`)
        continue
      }

      const confirmPassword = await readPassword('請再次輸入密碼: ')

      if (password !== confirmPassword) {
        console.log('❌ 兩次輸入的密碼不一致\n')
        continue
      }

      break
    }

    console.log('')
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('📡 連接資料庫...')
    await client.connect()

    const db = client.db()
    const adminUsersCollection = db.collection<AdminUserDocument>('admin_users')

    // 檢查是否已存在相同帳號
    const existingUser = await adminUsersCollection.findOne({
      $or: [
        { username: ADMIN_USERNAME },
        { email: ADMIN_EMAIL }
      ]
    })

    if (existingUser) {
      console.log('\n⚠️  警告: 已存在相同的帳號或 Email')
      console.log(`   帳號: ${existingUser.username}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log('\n是否要更新此帳號的密碼? (y/N): ')

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      const answer = await new Promise<string>((resolve) => {
        rl.question('', (ans) => {
          rl.close()
          resolve(ans)
        })
      })

      if (answer.toLowerCase() !== 'y') {
        console.log('\n❌ 取消操作')
        process.exit(0)
      }

      // 更新密碼
      console.log('\n🔐 加密密碼...')
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

      await adminUsersCollection.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            passwordHash,
            loginAttempts: 0,
            lockedUntil: null,
            updatedAt: new Date()
          }
        }
      )

      console.log('\n✅ 密碼更新成功!')
      console.log('\n帳號資訊:')
      console.log(`   帳號: ${existingUser.username}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   角色: ${existingUser.role}`)

    } else {
      // 建立新帳號
      console.log('🔐 加密密碼...')
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

      const adminUser: AdminUserDocument = {
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        passwordHash,
        displayName: ADMIN_DISPLAY_NAME,
        role: 'super_admin',
        permissions: ['*'],
        isActive: true,
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      console.log('💾 建立管理員帳號...')
      await adminUsersCollection.insertOne(adminUser)

      // 建立索引
      console.log('📋 建立索引...')
      await adminUsersCollection.createIndex({ username: 1 }, { unique: true })
      await adminUsersCollection.createIndex({ email: 1 }, { unique: true })
      await adminUsersCollection.createIndex({ isActive: 1, role: 1 })

      console.log('\n✅ Admin 帳號建立成功!')
      console.log('\n帳號資訊:')
      console.log(`   帳號: ${ADMIN_USERNAME}`)
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   顯示名稱: ${ADMIN_DISPLAY_NAME}`)
      console.log(`   角色: super_admin`)
      console.log(`   權限: * (所有權限)`)
    }

    console.log('\n========================================')
    console.log('現在可以使用此帳號登入後台系統')
    console.log('登入網址: http://localhost:3000/admin/login')
    console.log('========================================\n')

  } catch (error) {
    console.error('\n❌ 錯誤:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// 執行
seedAdmin()
