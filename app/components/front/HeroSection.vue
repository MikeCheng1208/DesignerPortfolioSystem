<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '~/types/database'

interface Props {
  title: string
  heroTitle: string
  heroSubtitle: string
  theme: ThemeConfig
}

const props = defineProps<Props>()

const heroStyle = computed(() => props.theme.layout.heroStyle)

// 處理標語的換行
const heroTitleLines = computed(() => props.heroTitle.split('\n'))
const heroSubtitleLines = computed(() => props.heroSubtitle.split('\n'))
</script>

<template>
  <section
    class="hero"
    :class="{
      'hero--centered': heroStyle === 'centered',
      'hero--left-aligned': heroStyle === 'left-aligned',
      'hero--fullscreen': heroStyle === 'fullscreen'
    }"
  >
    <div class="hero__container">
      <div class="hero__label">{{ title }}</div>
      <h1 class="hero__title">
        <span
          v-for="(line, index) in heroTitleLines"
          :key="index"
          class="hero__title-line"
          :style="{ animationDelay: `${0.3 + index * 0.2}s` }"
        >
          {{ line }}
        </span>
      </h1>
      <p class="hero__subtitle">
        <template v-for="(line, index) in heroSubtitleLines" :key="index">
          {{ line }}<br v-if="index < heroSubtitleLines.length - 1" />
        </template>
      </p>
      <a href="#work" class="hero__cta">
        <span>探索作品</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M10 16L16 10M10 16L4 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </div>
    <div class="hero__scroll">
      <div class="hero__scroll-indicator"></div>
    </div>

    <!-- 全屏背景裝飾 -->
    <div v-if="heroStyle === 'fullscreen'" class="hero__bg-decoration">
      <div class="hero__bg-gradient"></div>
      <div class="hero__bg-grid"></div>
    </div>
  </section>
</template>

<style scoped>
/* ==================== 基礎 Hero 樣式 ==================== */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 8rem 0 4rem;
}

.hero__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  width: 100%;
}

.hero__label {
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.2s forwards;
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--hero-title-size);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
}

.hero__title-line {
  display: block;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 600px;
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.7s forwards;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: var(--color-accent);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--border-radius-button);
  transition: all var(--animation-duration) var(--ease-out-expo);
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.9s forwards;
}

.hero__cta:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-card);
}

.hero__cta svg {
  transition: transform var(--animation-duration) var(--ease-out-expo);
}

.hero__cta:hover svg {
  transform: translateY(3px);
}

.hero__scroll {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
}

.hero__scroll-indicator {
  width: 1px;
  height: 60px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--color-text-muted),
    transparent
  );
  opacity: 0;
  animation:
    fadeIn 0.8s var(--ease-out-expo) 1.1s forwards,
    scrollIndicator 2s ease-in-out infinite;
}

/* ==================== 置中樣式 ==================== */
.hero--centered {
  justify-content: center;
}

.hero--centered .hero__container {
  text-align: center;
}

.hero--centered .hero__subtitle {
  margin-left: auto;
  margin-right: auto;
}

/* ==================== 左對齊樣式 ==================== */
.hero--left-aligned {
  justify-content: flex-start;
}

.hero--left-aligned .hero__container {
  text-align: left;
}

.hero--left-aligned .hero__title {
  max-width: 900px;
}

.hero--left-aligned .hero__subtitle {
  margin-left: 0;
  margin-right: 0;
}

/* ==================== 全屏樣式 ==================== */
.hero--fullscreen {
  min-height: 100vh;
  justify-content: center;
  overflow: hidden;
}

.hero--fullscreen .hero__container {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero--fullscreen .hero__title {
  background: linear-gradient(
    135deg,
    var(--color-text) 0%,
    var(--color-accent) 50%,
    var(--color-text) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease-in-out infinite;
}

.hero--fullscreen .hero__subtitle {
  margin-left: auto;
  margin-right: auto;
}

/* 背景裝飾 */
.hero__bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero__bg-gradient {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--color-accent) 10%, transparent) 0%,
    transparent 70%
  );
  opacity: 0.5;
}

.hero__bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      var(--color-border) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
}

/* ==================== 動畫 ==================== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes scrollIndicator {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* ==================== 響應式設計 ==================== */
@media (max-width: 1024px) {
  .hero {
    min-height: 80vh;
    padding: 6rem 0 3rem;
  }

  .hero__container {
    padding: 0 2rem;
  }

  .hero__label {
    margin-bottom: 1.5rem;
  }

  .hero__subtitle {
    font-size: 1.125rem;
    margin-bottom: 2.5rem;
  }

  .hero__cta {
    padding: 1rem 2rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 70vh;
    padding: 5rem 0 2rem;
  }

  .hero__container {
    padding: 0 1.5rem;
  }

  .hero__label {
    font-size: 0.8125rem;
    margin-bottom: 1.5rem;
  }

  .hero__subtitle {
    font-size: 1.0625rem;
    margin-bottom: 2rem;
  }

  .hero__cta {
    padding: 0.875rem 1.75rem;
    font-size: 0.9375rem;
  }

  .hero__scroll {
    bottom: 2rem;
  }

  /* 側邊導航時預留底部空間 */
  body.nav-side & {
    padding-bottom: 90px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 4rem 0 2rem;
  }

  .hero__container {
    padding: 0 1.25rem;
  }

  .hero__label {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
  }

  .hero__subtitle br {
    display: none;
  }

  .hero__cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
