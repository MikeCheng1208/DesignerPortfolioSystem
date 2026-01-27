/**
 * Admin 專用資料庫輔助函數
 * 提供後台管理需要的完整資料操作
 */

import { ObjectId } from 'mongodb'
import type {
  ProfileDocument,
  ProjectDocument,
  SkillCategoryDocument,
  ContactDocument
} from '~/types/database'

// ==================== Profile 相關 ====================

/**
 * 取得 Profile（完整資料，包含內部欄位）
 */
export async function getProfileForAdmin() {
  const collection = await getCollection<ProfileDocument>('profile')
  const profile = await collection.findOne({ isActive: true })
  return profile
}

/**
 * 更新 Profile
 */
export async function updateProfile(data: Partial<ProfileDocument>) {
  const collection = await getCollection<ProfileDocument>('profile')

  // 移除不應該被更新的欄位
  const { _id, createdAt, isActive, ...updateData } = data as any

  const result = await collection.findOneAndUpdate(
    { isActive: true },
    {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  return result
}

// ==================== Projects 相關 ====================

/**
 * 取得所有 Projects（包含未發布的）
 */
export async function getAllProjectsForAdmin() {
  const collection = await getCollection<ProjectDocument>('projects')
  const projects = await collection
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray()

  return projects
}

/**
 * 根據 _id 取得單一 Project
 */
export async function getProjectByIdForAdmin(id: string) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<ProjectDocument>('projects')
  const project = await collection.findOne({ _id: new ObjectId(id) })
  return project
}

/**
 * 建立 Project
 */
export async function createProject(data: Omit<ProjectDocument, '_id' | 'createdAt' | 'updatedAt'>) {
  const collection = await getCollection<ProjectDocument>('projects')

  const now = new Date()
  const project = {
    ...data,
    createdAt: now,
    updatedAt: now
  }

  const result = await collection.insertOne(project as ProjectDocument)
  return result
}

/**
 * 更新 Project
 */
export async function updateProject(id: string, data: Partial<ProjectDocument>) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<ProjectDocument>('projects')

  // 移除不應該被更新的欄位
  const { _id, createdAt, ...updateData } = data as any

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  return result
}

/**
 * 刪除 Project
 */
export async function deleteProject(id: string) {
  if (!ObjectId.isValid(id)) {
    return false
  }

  const collection = await getCollection<ProjectDocument>('projects')
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

/**
 * 切換 Project 發布狀態
 */
export async function toggleProjectPublish(id: string, published: boolean) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<ProjectDocument>('projects')
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        published,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  return result
}

// ==================== Skills 相關 ====================

/**
 * 取得所有 Skills（包含不可見的）
 */
export async function getAllSkillsForAdmin() {
  const collection = await getCollection<SkillCategoryDocument>('skills')
  const skills = await collection
    .find({})
    .sort({ order: 1 })
    .toArray()

  return skills
}

/**
 * 根據 _id 取得單一 Skill Category
 */
export async function getSkillByIdForAdmin(id: string) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<SkillCategoryDocument>('skills')
  const skill = await collection.findOne({ _id: new ObjectId(id) })
  return skill
}

/**
 * 建立 Skill Category
 */
export async function createSkillCategory(data: Omit<SkillCategoryDocument, '_id' | 'createdAt' | 'updatedAt'>) {
  const collection = await getCollection<SkillCategoryDocument>('skills')

  const now = new Date()
  const skill = {
    ...data,
    createdAt: now,
    updatedAt: now
  }

  const result = await collection.insertOne(skill as SkillCategoryDocument)
  return result
}

/**
 * 更新 Skill Category
 */
export async function updateSkillCategory(id: string, data: Partial<SkillCategoryDocument>) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<SkillCategoryDocument>('skills')

  // 移除不應該被更新的欄位
  const { _id, createdAt, ...updateData } = data as any

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  return result
}

/**
 * 刪除 Skill Category
 */
export async function deleteSkillCategory(id: string) {
  if (!ObjectId.isValid(id)) {
    return false
  }

  const collection = await getCollection<SkillCategoryDocument>('skills')
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

/**
 * 更新 Skills 排序
 */
export async function reorderSkills(orders: Array<{ id: string; order: number }>) {
  const collection = await getCollection<SkillCategoryDocument>('skills')

  const updates = orders.map(({ id, order }) => {
    if (!ObjectId.isValid(id)) {
      return null
    }

    return collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          order,
          updatedAt: new Date()
        }
      }
    )
  })

  const validUpdates = updates.filter(u => u !== null)
  await Promise.all(validUpdates)

  return true
}

// ==================== Contact 相關 ====================

/**
 * 取得 Contact（完整資料）
 */
export async function getContactForAdmin() {
  const collection = await getCollection<ContactDocument>('contact')
  const contact = await collection.findOne({ isActive: true })
  return contact
}

/**
 * 更新 Contact
 */
export async function updateContact(data: Partial<ContactDocument>) {
  const collection = await getCollection<ContactDocument>('contact')

  // 移除不應該被更新的欄位
  const { _id, createdAt, isActive, ...updateData } = data as any

  const result = await collection.findOneAndUpdate(
    { isActive: true },
    {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  return result
}

// ==================== 驗證函數 ====================

/**
 * 驗證 Profile 資料
 */
export function validateProfileData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('姓名為必填欄位')
  }

  if (!data.nameEn || typeof data.nameEn !== 'string' || data.nameEn.trim().length === 0) {
    errors.push('英文姓名為必填欄位')
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('職稱為必填欄位')
  }

  if (!data.bio || !Array.isArray(data.bio) || data.bio.length === 0) {
    errors.push('個人簡介為必填欄位')
  }

  if (!data.philosophy || typeof data.philosophy !== 'string' || data.philosophy.trim().length === 0) {
    errors.push('設計理念為必填欄位')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
