import type { AdminRole } from './database'

/**
 * 權限定義
 */
export const PERMISSIONS = {
  // Profile 權限
  PROFILE_READ: 'profile:read',
  PROFILE_WRITE: 'profile:write',

  // Projects 權限
  PROJECTS_READ: 'projects:read',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_PUBLISH: 'projects:publish',

  // Skills 權限
  SKILLS_READ: 'skills:read',
  SKILLS_WRITE: 'skills:write',
  SKILLS_DELETE: 'skills:delete',

  // Contact 權限
  CONTACT_READ: 'contact:read',
  CONTACT_WRITE: 'contact:write',

  // Users 權限
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // All 權限
  ALL: '*'
} as const

/**
 * 角色定義和預設權限
 */
export const ROLES = {
  super_admin: {
    name: 'Super Admin',
    description: '最高權限，可管理所有內容和帳號',
    permissions: [PERMISSIONS.ALL]
  },
  admin: {
    name: 'Admin',
    description: '一般管理員，可管理內容但無法刪除帳號',
    permissions: [
      PERMISSIONS.PROFILE_READ,
      PERMISSIONS.PROFILE_WRITE,
      PERMISSIONS.PROJECTS_READ,
      PERMISSIONS.PROJECTS_WRITE,
      PERMISSIONS.PROJECTS_DELETE,
      PERMISSIONS.PROJECTS_PUBLISH,
      PERMISSIONS.SKILLS_READ,
      PERMISSIONS.SKILLS_WRITE,
      PERMISSIONS.SKILLS_DELETE,
      PERMISSIONS.CONTACT_READ,
      PERMISSIONS.CONTACT_WRITE,
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_WRITE
    ]
  },
  editor: {
    name: 'Editor',
    description: '編輯者，僅可編輯內容',
    permissions: [
      PERMISSIONS.PROFILE_READ,
      PERMISSIONS.PROFILE_WRITE,
      PERMISSIONS.PROJECTS_READ,
      PERMISSIONS.PROJECTS_WRITE,
      PERMISSIONS.SKILLS_READ,
      PERMISSIONS.SKILLS_WRITE,
      PERMISSIONS.CONTACT_READ,
      PERMISSIONS.CONTACT_WRITE
    ]
  }
} as const

/**
 * 檢查角色是否擁有指定權限
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  // 如果有 ALL 權限，直接通過
  if (userPermissions.includes(PERMISSIONS.ALL)) {
    return true
  }

  // 檢查是否有精確匹配的權限
  if (userPermissions.includes(requiredPermission)) {
    return true
  }

  // 檢查通配符權限 (例如: projects:* 可以匹配 projects:read, projects:write)
  const [resource] = requiredPermission.split(':')
  const wildcardPermission = `${resource}:*`
  if (userPermissions.includes(wildcardPermission)) {
    return true
  }

  return false
}

/**
 * 檢查角色是否擁有所有指定權限
 */
export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission))
}

/**
 * 檢查角色是否擁有任一指定權限
 */
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission))
}

/**
 * 取得角色的預設權限
 */
export function getRolePermissions(role: AdminRole): string[] {
  return ROLES[role]?.permissions || []
}
