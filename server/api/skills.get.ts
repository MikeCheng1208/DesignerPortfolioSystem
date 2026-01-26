import type { SkillCategory } from '~/types/api'

/**
 * GET /api/skills
 * 獲取技能列表
 */
export default defineEventHandler((): SkillCategory[] => {
  return [
    {
      id: 'design-expertise',
      title: '設計專長',
      skills: [
        '使用者體驗設計 (UX Design)',
        '介面設計 (UI Design)',
        '互動原型設計 (Prototyping)',
        '設計系統 (Design System)',
        '使用者研究 (User Research)'
      ]
    },
    {
      id: 'design-tools',
      title: '設計工具',
      skills: [
        'Figma',
        'Adobe Creative Suite',
        'Principle',
        'ProtoPie',
        'Framer'
      ]
    }
  ]
})
