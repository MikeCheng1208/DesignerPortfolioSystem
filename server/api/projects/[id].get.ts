import type { ProjectDetail } from '~/types/api'

/**
 * GET /api/projects/:id
 * 獲取特定作品的詳細資訊
 */
export default defineEventHandler((event): ProjectDetail | null => {
  const id = getRouterParam(event, 'id')

  // 專案資料庫
  const projects: Record<string, ProjectDetail> = {
    'fintech-app': {
      id: 'fintech-app',
      title: '金融科技應用重設計',
      category: 'Mobile App',
      year: '2025',
      description: '重新設計投資理財應用程式,提升使用者投資決策效率',
      tags: ['UX Research', 'UI Design', 'Prototyping'],
      coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overview: '這是一個針對年輕投資族群設計的理財應用程式。原有介面複雜且資訊過載,導致使用者難以快速做出投資決策。透過深入的使用者研究和多次迭代,我們重新設計了整體體驗,將複雜的金融資訊轉化為直覺易懂的視覺呈現。',
      client: '某金融科技公司',
      duration: '4 個月',
      role: '主導 UI/UX 設計',
      tools: 'Figma, Principle, After Effects',
      challenge: '原應用程式的主要問題在於資訊架構混亂,使用者需要點擊多層才能查看重要資訊。此外,大量的專業術語和數據讓新手投資者感到困惑,導致轉換率低落。',
      solution: '我們採用卡片式設計系統,將資訊分層呈現,讓使用者可以快速掌握關鍵數據。同時引入視覺化圖表和顏色編碼系統,降低理解門檻。透過簡化操作流程,將投資流程從原本的 7 步驟縮減至 3 步驟。',
      images: [
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          label: '首頁設計',
          caption: '清晰的資訊層級和視覺化數據呈現'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          label: '投資組合',
          caption: '直覺的投資組合管理介面'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #667eea 30%, #764ba2 100%)',
          label: '交易流程',
          caption: '簡化的交易操作流程'
        },
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          label: '數據視覺化',
          caption: '互動式圖表讓數據更易理解'
        }
      ],
      results: [
        { value: '+40%', label: '轉換率提升' },
        { value: '+65%', label: '使用者滿意度' },
        { value: '-50%', label: '操作步驟減少' },
        { value: '4.8/5', label: 'App Store 評分' }
      ]
    },
    'design-system': {
      id: 'design-system',
      title: '企業級設計系統',
      category: 'Design System',
      year: '2025',
      description: '建立可擴展的設計系統,統一多平台的使用者體驗',
      tags: ['Design System', 'Component Library', 'Documentation'],
      coverGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      overview: '為一家大型企業建立完整的設計系統,涵蓋 Web、iOS 和 Android 三個平台。這個設計系統不僅統一了視覺語言,更建立了清晰的設計流程和開發規範,大幅提升團隊協作效率。',
      client: '某科技企業',
      duration: '6 個月',
      role: '設計系統負責人',
      tools: 'Figma, Storybook, Zeroheight',
      challenge: '公司產品線眾多,各團隊使用不同的設計規範,導致使用者體驗不一致。設計師和工程師之間的溝通成本高,重複造輪子的情況嚴重。',
      solution: '建立了包含 150+ 組件的設計系統,涵蓋基礎元件、複合組件和業務組件。透過詳細的使用指南和程式碼範例,確保團隊能夠正確使用。同時建立設計 Token 系統,實現主題切換和品牌客製化。',
      images: [
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          label: '設計原則',
          caption: '清晰的設計原則指導整個系統'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
          label: '基礎組件',
          caption: '可重用的基礎組件庫'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #f093fb 30%, #f5576c 100%)',
          label: 'Design Tokens',
          caption: '系統化的設計參數管理'
        },
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          label: '文檔系統',
          caption: '完整的使用文檔和範例'
        }
      ],
      results: [
        { value: '150+', label: '組件數量' },
        { value: '-60%', label: '設計時間減少' },
        { value: '95%', label: '團隊採用率' },
        { value: '3x', label: '開發效率提升' }
      ]
    },
    'ecommerce-platform': {
      id: 'ecommerce-platform',
      title: '電商平台體驗優化',
      category: 'Web Platform',
      year: '2024',
      description: '透過數據分析與使用者研究,提升轉換率 40%',
      tags: ['UX Design', 'A/B Testing', 'Analytics'],
      coverGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      overview: '針對一個中型電商平台進行全面的使用者體驗優化。透過數據分析發現關鍵問題,並透過 A/B 測試驗證設計假設,最終實現轉換率的顯著提升。',
      client: '某電商平台',
      duration: '3 個月',
      role: 'UX 設計師',
      tools: 'Figma, Google Analytics, Hotjar',
      challenge: '平台的購物車放棄率高達 70%,結帳流程冗長,且行動裝置體驗不佳。使用者反映找不到想要的商品,搜尋功能效果差。',
      solution: '重新設計結帳流程,從 6 步驟簡化為 3 步驟,並加入訪客結帳選項。優化搜尋功能,加入智能推薦和篩選器。針對行動裝置優化觸控體驗,增大點擊區域並簡化導航。',
      images: [
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          label: '首頁優化',
          caption: '更清晰的產品展示和導航'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          label: '搜尋功能',
          caption: '智能搜尋和推薦系統'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #4facfe 30%, #00f2fe 100%)',
          label: '產品頁面',
          caption: '優化的產品資訊呈現'
        },
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          label: '結帳流程',
          caption: '簡化的結帳體驗'
        }
      ],
      results: [
        { value: '+40%', label: '轉換率提升' },
        { value: '-30%', label: '購物車放棄率降低' },
        { value: '+55%', label: '行動裝置訂單' },
        { value: '2.5 分鐘', label: '平均結帳時間' }
      ]
    },
    'health-app': {
      id: 'health-app',
      title: '健康管理應用',
      category: 'Mobile App',
      year: '2024',
      description: '設計直覺的健康追蹤介面,幫助使用者養成健康習慣',
      tags: ['UI Design', 'Interaction Design', 'User Research'],
      coverGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      overview: '為健康管理應用設計全新的使用者介面,專注於提升使用者的長期參與度。透過遊戲化設計和社群功能,鼓勵使用者養成健康的生活習慣。',
      client: '某健康科技新創',
      duration: '5 個月',
      role: '主導 UI/UX 設計',
      tools: 'Figma, ProtoPie, Sketch',
      challenge: '使用者通常在下載後的第一週非常活躍,但之後參與度急劇下降。如何維持長期使用是最大的挑戰。',
      solution: '引入遊戲化元素,包括成就系統、挑戰和排行榜。設計簡單但有意義的互動,讓記錄健康數據變得輕鬆有趣。加入社群功能,讓使用者可以與朋友一起設定目標。',
      images: [
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          label: '儀表板',
          caption: '清晰的健康數據總覽'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
          label: '活動追蹤',
          caption: '直覺的活動記錄介面'
        },
        {
          layout: 'half',
          gradient: 'linear-gradient(135deg, #43e97b 30%, #38f9d7 100%)',
          label: '成就系統',
          caption: '遊戲化的激勵機制'
        },
        {
          layout: 'full',
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          label: '社群功能',
          caption: '與朋友一起達成健康目標'
        }
      ],
      results: [
        { value: '+120%', label: '30 天留存率' },
        { value: '+85%', label: '每日活躍用戶' },
        { value: '4.7/5', label: '使用者評分' },
        { value: '75%', label: '目標達成率' }
      ]
    }
  }

  // 根據 ID 返回對應的專案,如果不存在則返回 null
  if (id && projects[id]) {
    return projects[id]
  }

  // 404 - 專案不存在
  setResponseStatus(event, 404)
  return null
})
