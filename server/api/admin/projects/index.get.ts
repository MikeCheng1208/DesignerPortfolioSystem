/**
 * 取得所有 Projects 列表 API (Admin)
 * GET /api/admin/projects
 * 包含未發布的作品
 */

export default defineEventHandler(async (event) => {
  try {
    // 取得所有 Projects（包含未發布的）
    const projects = await getAllProjectsForAdmin()

    // 轉換為 API 回應格式
    const projectList = projects.map(project => ({
      _id: project._id.toString(),
      projectId: project.projectId,
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      tags: project.tags,
      color: project.color,
      published: project.published,
      featured: project.featured,
      order: project.order,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }))

    return {
      success: true,
      projects: projectList,
      total: projectList.length
    }
  } catch (error: any) {
    console.error('取得 Projects 列表錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得作品列表時發生錯誤'
    })
  }
})
