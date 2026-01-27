/**
 * 取得儀表板統計資訊 API (Admin)
 * GET /api/admin/dashboard/stats
 */

import { COLLECTIONS } from '~/types/database'

export default defineEventHandler(async (event) => {
  try {
    // 取得各項統計
    const [
      totalProjects,
      publishedProjects,
      totalSkills,
      visibleSkills,
      totalUsers,
      activeUsers
    ] = await Promise.all([
      // Projects 統計
      getCollection(COLLECTIONS.PROJECTS).then(c => c.countDocuments()),
      getCollection(COLLECTIONS.PROJECTS).then(c => c.countDocuments({ published: true })),

      // Skills 統計
      getCollection(COLLECTIONS.SKILLS).then(c => c.countDocuments()),
      getCollection(COLLECTIONS.SKILLS).then(c => c.countDocuments({ isVisible: true })),

      // Users 統計
      getCollection(COLLECTIONS.ADMIN_USERS).then(c => c.countDocuments()),
      getCollection(COLLECTIONS.ADMIN_USERS).then(c => c.countDocuments({ isActive: true }))
    ])

    // 取得最近的 Projects
    const recentProjects = await getCollection(COLLECTIONS.PROJECTS)
      .then(c => c.find({})
        .sort({ updatedAt: -1 })
        .limit(5)
        .toArray()
      )

    // 取得最近登入的 Users
    const recentUsers = await getCollection(COLLECTIONS.ADMIN_USERS)
      .then(c => c.find({ lastLoginAt: { $exists: true } })
        .sort({ lastLoginAt: -1 })
        .limit(5)
        .toArray()
      )

    return {
      success: true,
      stats: {
        projects: {
          total: totalProjects,
          published: publishedProjects,
          draft: totalProjects - publishedProjects
        },
        skills: {
          total: totalSkills,
          visible: visibleSkills,
          hidden: totalSkills - visibleSkills
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        }
      },
      recent: {
        projects: recentProjects.map(p => ({
          _id: p._id.toString(),
          title: p.title,
          published: p.published,
          updatedAt: p.updatedAt.toISOString()
        })),
        users: recentUsers.map(u => ({
          _id: u._id.toString(),
          displayName: u.displayName,
          username: u.username,
          lastLoginAt: u.lastLoginAt?.toISOString()
        }))
      }
    }
  } catch (error: any) {
    console.error('取得儀表板統計錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得統計資訊時發生錯誤'
    })
  }
})
