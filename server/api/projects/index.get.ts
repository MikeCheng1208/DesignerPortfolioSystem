import type { ProjectCard } from '~/types/api'

/**
 * GET /api/projects
 * 獲取作品列表 (首頁用)
 */
export default defineEventHandler((): ProjectCard[] => {
  return [
    {
      id: 'fintech-app',
      title: '金融科技應用重設計',
      category: 'Mobile App',
      year: '2025',
      description: '重新設計投資理財應用程式,提升使用者投資決策效率',
      tags: ['UX Research', 'UI Design', 'Prototyping'],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'design-system',
      title: '企業級設計系統',
      category: 'Design System',
      year: '2025',
      description: '建立可擴展的設計系統,統一多平台的使用者體驗',
      tags: ['Design System', 'Component Library', 'Documentation'],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'ecommerce-platform',
      title: '電商平台體驗優化',
      category: 'Web Platform',
      year: '2024',
      description: '透過數據分析與使用者研究,提升轉換率 40%',
      tags: ['UX Design', 'A/B Testing', 'Analytics'],
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'health-app',
      title: '健康管理應用',
      category: 'Mobile App',
      year: '2024',
      description: '設計直覺的健康追蹤介面,幫助使用者養成健康習慣',
      tags: ['UI Design', 'Interaction Design', 'User Research'],
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ]
})
