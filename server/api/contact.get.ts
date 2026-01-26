import type { ContactInfo } from '~/types/api'

/**
 * GET /api/contact
 * 獲取聯絡資訊
 */
export default defineEventHandler((): ContactInfo => {
  return {
    text: '對於合作機會或設計諮詢,歡迎隨時與我聯繫。',
    links: [
      {
        id: 'email',
        label: 'Email',
        value: 'lee.songnian@example.com',
        url: 'mailto:lee.songnian@example.com'
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin.com/in/leesongnian',
        url: 'https://linkedin.com/in/leesongnian'
      },
      {
        id: 'dribbble',
        label: 'Dribbble',
        value: 'dribbble.com/leesongnian',
        url: 'https://dribbble.com/leesongnian'
      },
      {
        id: 'behance',
        label: 'Behance',
        value: 'behance.net/leesongnian',
        url: 'https://behance.net/leesongnian'
      }
    ]
  }
})
