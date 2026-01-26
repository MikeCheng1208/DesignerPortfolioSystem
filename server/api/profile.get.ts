import type { Profile } from '~/types/api'

/**
 * GET /api/profile
 * 獲取個人基本資訊
 */
export default defineEventHandler((): Profile => {
  return {
    name: '李松年',
    nameEn: 'Lee Song-Nian',
    title: 'UI/UX Designer',
    bio: [
      '我是李松年,一位專注於創造直覺、優雅數位體驗的 UI/UX 設計師。',
      '在過去的設計生涯中,我始終相信好的設計不僅是視覺上的美觀,更重要的是能夠解決真實的問題,為使用者創造價值。我擅長將複雜的需求轉化為簡潔、易用的介面,並透過細膩的互動設計提升使用者體驗。',
      '我的設計哲學是:少即是多。透過精準的設計語言和克制的視覺表達,讓產品的本質自然浮現。'
    ],
    philosophy: '少即是多',
    photo: '/profile.jpg' // 可選,如果沒有照片可以不設定
  }
})
