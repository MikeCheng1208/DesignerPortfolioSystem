<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ThemeConfig } from '~/types/database'

interface Props {
  siteName: string
  theme: ThemeConfig
}

const props = defineProps<Props>()

const scrolled = ref(false)

const navStyle = computed(() => props.theme.layout.navStyle)
const isSideNav = computed(() => navStyle.value === 'side')

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- 側邊導航 -->
  <nav v-if="isSideNav" class="side-nav">
    <div class="side-nav__container">
      <a href="#" class="side-nav__logo">{{ siteName }}</a>
      <div class="side-nav__links">
        <a href="#work" class="side-nav__link">
          <span class="side-nav__link-text">作品</span>
          <span class="side-nav__link-number">01</span>
        </a>
        <a href="#about" class="side-nav__link">
          <span class="side-nav__link-text">關於</span>
          <span class="side-nav__link-number">02</span>
        </a>
        <a href="#contact" class="side-nav__link">
          <span class="side-nav__link-text">聯絡</span>
          <span class="side-nav__link-number">03</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- 頂部導航 -->
  <nav
    v-else
    class="top-nav"
    :class="{
      'top-nav--scrolled': scrolled,
      'top-nav--blur': navStyle === 'top-blur',
      'top-nav--solid': navStyle === 'top-solid',
      'top-nav--minimal': navStyle === 'top-minimal'
    }"
  >
    <div class="top-nav__container">
      <a href="#" class="top-nav__logo">{{ siteName }}</a>
      <div class="top-nav__links">
        <a href="#work" class="top-nav__link">作品</a>
        <a href="#about" class="top-nav__link">關於</a>
        <a href="#contact" class="top-nav__link">聯絡</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ==================== 頂部導航 ==================== */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 2rem 0;
  transition: all 0.4s var(--ease-out-expo);
}

/* 滾動後的樣式 */
.top-nav--scrolled {
  padding: 1rem 0;
}

/* 毛玻璃樣式 */
.top-nav--blur.top-nav--scrolled {
  background: color-mix(in srgb, var(--color-bg) calc(var(--nav-bg-opacity) * 100%), transparent);
  backdrop-filter: var(--nav-blur);
  border-bottom: 1px solid var(--color-border);
}

/* 實心樣式 */
.top-nav--solid {
  border-bottom: 1px solid var(--color-border);
}

.top-nav--solid.top-nav--scrolled {
  background: var(--color-bg);
}

/* 極簡樣式 */
.top-nav--minimal {
  background: transparent;
}

.top-nav--minimal.top-nav--scrolled {
  background: var(--color-bg);
}

.top-nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-nav__logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.top-nav__links {
  display: flex;
  gap: 3rem;
}

.top-nav__link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  position: relative;
  transition: color var(--animation-duration) ease;
}

.top-nav__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width var(--animation-duration) var(--ease-out-expo);
}

.top-nav__link:hover {
  color: var(--color-text);
}

.top-nav__link:hover::after {
  width: 100%;
}

/* ==================== 側邊導航 ==================== */
.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100px;
  z-index: 1000;
  background: color-mix(in srgb, var(--color-bg) calc(var(--nav-bg-opacity) * 100%), transparent);
  backdrop-filter: var(--nav-blur);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.side-nav__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0;
}

.side-nav__logo {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: 0.05em;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-nav__links {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
}

.side-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  text-decoration: none;
  color: var(--color-text-muted);
  transition: all var(--animation-duration) var(--ease-out-expo);
  position: relative;
}

.side-nav__link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 0;
  background: var(--color-accent);
  transition: height var(--animation-duration) var(--ease-out-expo);
}

.side-nav__link:hover {
  color: var(--color-accent);
}

.side-nav__link:hover::before {
  height: 40px;
}

.side-nav__link-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.side-nav__link-number {
  font-family: var(--font-display);
  font-size: 0.625rem;
  color: var(--color-text-muted);
  margin-top: 0.75rem;
  opacity: 0.5;
}

/* ==================== 響應式設計 ==================== */
@media (max-width: 768px) {
  /* 側邊導航在手機版變成底部導航 */
  .side-nav {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 70px;
    flex-direction: row;
    border-right: none;
    border-top: 1px solid var(--color-border);
  }

  .side-nav__container {
    flex-direction: row;
    padding: 0 1rem;
    align-items: center;
  }

  .side-nav__logo {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
    padding: 0;
    font-size: 1rem;
  }

  .side-nav__links {
    flex-direction: row;
    justify-content: flex-end;
    gap: 0;
  }

  .side-nav__link {
    flex-direction: row;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }

  .side-nav__link::before {
    display: none;
  }

  .side-nav__link-text {
    writing-mode: horizontal-tb;
    font-size: 0.8125rem;
  }

  .side-nav__link-number {
    display: none;
  }

  /* 頂部導航 */
  .top-nav {
    padding: 1.5rem 0;
  }

  .top-nav__container {
    padding: 0 1.5rem;
  }

  .top-nav__logo {
    font-size: 1.25rem;
  }

  .top-nav__links {
    gap: 1.5rem;
  }

  .top-nav__link {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .top-nav__container {
    padding: 0 1rem;
  }

  .top-nav__links {
    gap: 1rem;
  }

  .top-nav__link {
    font-size: 0.75rem;
  }
}
</style>
