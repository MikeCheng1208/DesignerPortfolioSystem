import type { ThemeConfig } from '~/types/database'
import { DEFAULT_THEMES, getThemeById } from '~/types/database'

/**
 * 根據排版設定生成對應的 CSS 值
 */
function getLayoutCssValues(theme: ThemeConfig) {
  // Hero 標題大小
  const heroTitleSizeMap = {
    normal: 'clamp(3rem, 8vw, 5rem)',
    large: 'clamp(3.5rem, 10vw, 6.5rem)',
    xlarge: 'clamp(4rem, 12vw, 8rem)'
  }

  // 區段間距
  const sectionSpacingMap = {
    compact: '4rem',
    normal: '8rem',
    spacious: '12rem'
  }

  // 動畫時間
  const animationDurationMap = {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s'
  }

  // 卡片 hover 效果
  const cardHoverMap = {
    lift: {
      transform: 'translateY(-8px)',
      shadow: theme.effects.shadowCard
    },
    glow: {
      transform: 'translateY(-4px)',
      shadow: `0 0 40px ${theme.colors.accent}40`
    },
    scale: {
      transform: 'scale(1.02)',
      shadow: theme.effects.shadowCard
    },
    none: {
      transform: 'none',
      shadow: theme.effects.shadowCard
    }
  }

  const cardHover = cardHoverMap[theme.animations.cardHover]

  return {
    heroTitleSize: heroTitleSizeMap[theme.layout.heroTitleSize],
    sectionSpacing: sectionSpacingMap[theme.layout.sectionSpacing],
    animationDuration: animationDurationMap[theme.animations.duration],
    cardHoverTransform: cardHover.transform,
    cardHoverShadow: cardHover.shadow
  }
}

/**
 * 主題管理 composable
 * 提供動態切換主題的功能，支援 SSR
 */
export function useTheme() {
  /**
   * 將主題配置轉換為 CSS 變數字串（用於 SSR 注入）
   */
  function generateInlineStyles(theme: ThemeConfig): string {
    const layoutValues = getLayoutCssValues(theme)

    return `
      :root {
        /* 顏色系統 */
        --color-bg: ${theme.colors.bg};
        --color-bg-secondary: ${theme.colors.bgSecondary};
        --color-text: ${theme.colors.text};
        --color-text-muted: ${theme.colors.textMuted};
        --color-accent: ${theme.colors.accent};
        --color-accent-hover: ${theme.colors.accentHover};
        --color-border: ${theme.colors.border};

        /* 字體系統 */
        --font-display: ${theme.fonts.display};
        --font-body: ${theme.fonts.body};

        /* 效果系統 */
        --border-radius-button: ${theme.effects.borderRadiusButton};
        --border-radius-card: ${theme.effects.borderRadiusCard};
        --shadow-card: ${theme.effects.shadowCard};
        --nav-blur: ${theme.effects.navBlur};
        --nav-bg-opacity: ${theme.effects.navBgOpacity};

        /* 排版系統 */
        --hero-style: ${theme.layout.heroStyle};
        --hero-title-size: ${layoutValues.heroTitleSize};
        --projects-layout: ${theme.layout.projectsLayout};
        --projects-columns: ${theme.layout.projectsColumns};
        --card-style: ${theme.layout.cardStyle};
        --nav-style: ${theme.layout.navStyle};
        --section-spacing: ${layoutValues.sectionSpacing};

        /* 動畫系統 */
        --animation-duration: ${layoutValues.animationDuration};
        --card-hover-transform: ${layoutValues.cardHoverTransform};
        --card-hover-shadow: ${layoutValues.cardHoverShadow};
      }
    `.trim()
  }

  /**
   * 在客戶端動態套用主題
   */
  function applyTheme(theme: ThemeConfig) {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const layoutValues = getLayoutCssValues(theme)

    // 設定顏色變數
    root.style.setProperty('--color-bg', theme.colors.bg)
    root.style.setProperty('--color-bg-secondary', theme.colors.bgSecondary)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-muted', theme.colors.textMuted)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-accent-hover', theme.colors.accentHover)
    root.style.setProperty('--color-border', theme.colors.border)

    // 設定字體變數
    root.style.setProperty('--font-display', theme.fonts.display)
    root.style.setProperty('--font-body', theme.fonts.body)

    // 設定效果變數
    root.style.setProperty('--border-radius-button', theme.effects.borderRadiusButton)
    root.style.setProperty('--border-radius-card', theme.effects.borderRadiusCard)
    root.style.setProperty('--shadow-card', theme.effects.shadowCard)
    root.style.setProperty('--nav-blur', theme.effects.navBlur)
    root.style.setProperty('--nav-bg-opacity', String(theme.effects.navBgOpacity))

    // 設定排版變數
    root.style.setProperty('--hero-style', theme.layout.heroStyle)
    root.style.setProperty('--hero-title-size', layoutValues.heroTitleSize)
    root.style.setProperty('--projects-layout', theme.layout.projectsLayout)
    root.style.setProperty('--projects-columns', String(theme.layout.projectsColumns))
    root.style.setProperty('--card-style', theme.layout.cardStyle)
    root.style.setProperty('--nav-style', theme.layout.navStyle)
    root.style.setProperty('--section-spacing', layoutValues.sectionSpacing)

    // 設定動畫變數
    root.style.setProperty('--animation-duration', layoutValues.animationDuration)
    root.style.setProperty('--card-hover-transform', layoutValues.cardHoverTransform)
    root.style.setProperty('--card-hover-shadow', layoutValues.cardHoverShadow)

    // 設定 body class 來控制導航樣式
    document.body.classList.remove('nav-top-blur', 'nav-top-solid', 'nav-top-minimal', 'nav-side')
    document.body.classList.add(`nav-${theme.layout.navStyle}`)

    // 設定 hero 樣式 class
    document.body.classList.remove('hero-centered', 'hero-left-aligned', 'hero-fullscreen')
    document.body.classList.add(`hero-${theme.layout.heroStyle}`)

    // 設定卡片樣式 class
    document.body.classList.remove('card-elevated', 'card-flat', 'card-outlined', 'card-glowing')
    document.body.classList.add(`card-${theme.layout.cardStyle}`)
  }

  /**
   * 取得預設主題
   */
  function getDefaultTheme(): ThemeConfig {
    return DEFAULT_THEMES[0]
  }

  /**
   * 取得所有可用主題
   */
  function getAllThemes(): ThemeConfig[] {
    return DEFAULT_THEMES
  }

  /**
   * 根據 ID 取得主題
   */
  function getTheme(themeId: string): ThemeConfig {
    return getThemeById(themeId)
  }

  return {
    generateInlineStyles,
    applyTheme,
    getDefaultTheme,
    getAllThemes,
    getTheme
  }
}
