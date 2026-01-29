<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import type { ProjectDetail, ProjectCard, SiteSettings } from '~/types/api'
import Lightbox from '~/components/Lightbox.vue'

const route = useRoute()
const projectId = route.params.id as string
const lightboxRef = ref()

// 從 app.vue 注入網站設定
const siteSettings = inject<Ref<SiteSettings | null>>('siteSettings')

const openLightbox = (index: number) => {
  lightboxRef.value?.open(index)
}

// 使用 useFetch 從 API 獲取專案詳細資訊
const { data: project } = await useFetch<ProjectDetail>(`/api/projects/${projectId}`)

// 獲取所有專案列表,用於計算上一個/下一個專案
const { data: allProjects } = await useFetch<ProjectCard[]>('/api/projects')

// 計算當前專案的索引
const currentIndex = computed(() => {
  if (!allProjects.value) return -1
  return allProjects.value.findIndex(p => p.id === projectId)
})

// 計算上一個專案
const previousProject = computed(() => {
  if (!allProjects.value || currentIndex.value <= 0) return null
  return allProjects.value[currentIndex.value - 1]
})

// 計算下一個專案
const nextProject = computed(() => {
  if (!allProjects.value || currentIndex.value >= allProjects.value.length - 1) return null
  return allProjects.value[currentIndex.value + 1]
})

// SEO
useHead(() => ({
  title: project.value
    ? `${project.value.title} - ${siteSettings?.value?.siteName || '作品集'}`
    : '專案不存在',
  meta: [
    { name: 'description', content: project.value?.description || '' }
  ]
}))
</script>

<template>
  <div class="project-detail">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav__container">
        <NuxtLink to="/" class="nav__back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M4 10L10 16M4 10L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回首頁</span>
        </NuxtLink>
        <NuxtLink to="/" class="nav__logo">{{ siteSettings?.siteName || '首頁' }}</NuxtLink>
      </div>
    </nav>

    <div v-if="project" class="project">
      <!-- Hero Section -->
      <section class="project-hero">
        <div class="project-hero__container">
          <div class="project-hero__meta">
            <span class="project-hero__category">{{ project.category }}</span>
            <span class="project-hero__separator">·</span>
            <span class="project-hero__year">{{ project.year }}</span>
          </div>
          <h1 class="project-hero__title">{{ project.title }}</h1>
          <p class="project-hero__description">{{ project.description }}</p>

          <div class="project-hero__tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </section>

      <!-- Cover Image -->
      <section class="project-cover">
        <div class="project-cover__container">
          <div class="project-cover__image" :style="{ background: project.coverGradient }">
            <img
              v-if="project.coverImage"
              :src="project.coverImage"
              :alt="project.title"
              class="project-cover__img"
              loading="lazy"
            />
            <div v-else class="project-cover__overlay">
              <span class="project-cover__label">專案封面</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Project Overview -->
      <section class="project-overview">
        <div class="project-overview__container">
          <div class="project-overview__content">
            <div class="project-overview__section">
              <h2 class="section-title">專案概述</h2>
              <p class="project-overview__text">{{ project.overview }}</p>
            </div>

            <div class="project-overview__grid">
              <div class="project-overview__item">
                <h3 class="project-overview__label">客戶</h3>
                <p class="project-overview__value">{{ project.client }}</p>
              </div>
              <div class="project-overview__item">
                <h3 class="project-overview__label">時間</h3>
                <p class="project-overview__value">{{ project.duration }}</p>
              </div>
              <div class="project-overview__item">
                <h3 class="project-overview__label">角色</h3>
                <p class="project-overview__value">{{ project.role }}</p>
              </div>
              <div class="project-overview__item">
                <h3 class="project-overview__label">工具</h3>
                <p class="project-overview__value">{{ project.tools }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Challenge & Solution -->
      <section class="project-content">
        <div class="project-content__container">
          <div class="project-content__section">
            <h2 class="section-title">挑戰</h2>
            <p class="project-content__text">{{ project.challenge }}</p>
          </div>

          <div class="project-content__section">
            <h2 class="section-title">解決方案</h2>
            <p class="project-content__text">{{ project.solution }}</p>
          </div>
        </div>
      </section>

      <!-- Image Gallery -->
      <section class="project-gallery">
        <div class="project-gallery__container">
          <h2 class="section-title">視覺設計</h2>

          <div class="gallery">
            <div
              v-for="(image, index) in project.images"
              :key="index"
              class="gallery__item"
              :class="`gallery__item--${image.layout}`"
              :style="{ animationDelay: `${index * 100}ms` }"
              @click="openLightbox(index)"
            >
              <div class="gallery__image" :style="{ background: image.gradient }">
                <img
                  v-if="image.src"
                  :src="image.src"
                  :alt="image.label"
                  class="gallery__img"
                  loading="lazy"
                />
                <div v-else class="gallery__label">{{ image.label }}</div>
                <div class="gallery__overlay">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H21V9M9 21H3V15M21 3L13.5 10.5M3 21L10.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <p v-if="image.caption" class="gallery__caption">{{ image.caption }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Results -->
      <section v-if="project.showResults !== false && project.results && project.results.length > 0" class="project-results">
        <div class="project-results__container">
          <h2 class="section-title">成果</h2>
          <div class="results-grid">
            <div
              v-for="(result, index) in project.results"
              :key="index"
              class="result-card"
            >
              <div class="result-card__value">{{ result.value }}</div>
              <div class="result-card__label">{{ result.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation to other projects -->
      <section class="project-nav">
        <div class="project-nav__container">
          <NuxtLink
            v-if="previousProject"
            :to="`/work/${previousProject.id}`"
            class="project-nav__link project-nav__link--prev"
          >
            <span class="project-nav__label">上一個專案</span>
            <span class="project-nav__title">{{ previousProject.title }}</span>
          </NuxtLink>

          <NuxtLink
            v-if="nextProject"
            :to="`/work/${nextProject.id}`"
            class="project-nav__link project-nav__link--next"
          >
            <span class="project-nav__label">下一個專案</span>
            <span class="project-nav__title">{{ nextProject.title }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- 404 State -->
    <div v-else class="not-found">
      <h1>專案不存在</h1>
      <NuxtLink to="/" class="btn-primary">返回首頁</NuxtLink>
    </div>

    <!-- Lightbox -->
    <Lightbox v-if="project" ref="lightboxRef" :images="project.images" />
  </div>
</template>

<style scoped>
/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 2rem 0;
  background: rgba(250, 250, 249, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s var(--ease-out-expo);
}

.nav__back:hover {
  color: var(--color-text);
  transform: translateX(-4px);
}

.nav__logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

/* Project Hero */
.project-hero {
  padding: 10rem 0 4rem;
  background: var(--color-bg);
}

.project-hero__container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 3rem;
  text-align: center;
}

.project-hero__meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.2s forwards;
}

.project-hero__separator {
  opacity: 0.5;
}

.project-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.3s forwards;
}

.project-hero__description {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.4s forwards;
}

.project-hero__tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.5s forwards;
}

.tag {
  padding: 0.75rem 1.5rem;
  background: white;
  font-size: 0.875rem;
  border-radius: 100px;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

/* Cover Image */
.project-cover {
  padding: 4rem 0;
  background: var(--color-bg);
}

.project-cover__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.project-cover__image {
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.6s forwards;
}

.project-cover__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-cover__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.project-cover__label {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-display);
  font-weight: 300;
}

/* Project Overview */
.project-overview {
  padding: 6rem 0;
  background: white;
}

.project-overview__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
}

.project-overview__content {
  display: grid;
  gap: 4rem;
}

.project-overview__section {
  max-width: 800px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
}

.project-overview__text {
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--color-text-muted);
}

.project-overview__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
}

.project-overview__item {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.project-overview__label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.project-overview__value {
  font-size: 1.125rem;
  color: var(--color-text);
}

/* Project Content */
.project-content {
  padding: 6rem 0;
  background: var(--color-bg);
}

.project-content__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  display: grid;
  gap: 5rem;
}

.project-content__section {
  max-width: 800px;
}

.project-content__text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-muted);
}

/* Gallery */
.project-gallery {
  padding: 6rem 0;
  background: white;
}

.project-gallery__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 3rem;
}

.gallery__item {
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
  cursor: pointer;
}

.gallery__item--full {
  grid-column: 1 / -1;
}

.gallery__image {
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.6s var(--ease-out-expo);
}

.gallery__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-expo);
}

.gallery__item:hover .gallery__img {
  transform: scale(1.05);
}

.gallery__item:hover .gallery__image {
  transform: scale(1.02);
}

.gallery__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s var(--ease-out-expo);
}

.gallery__overlay svg {
  color: white;
  transform: scale(0.8);
  transition: transform 0.3s var(--ease-out-expo);
}

.gallery__item:hover .gallery__overlay {
  opacity: 1;
}

.gallery__item:hover .gallery__overlay svg {
  transform: scale(1);
}

.gallery__label {
  font-family: var(--font-display);
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
  transition: opacity 0.3s var(--ease-out-expo);
}

.gallery__item:hover .gallery__label {
  opacity: 0.6;
}

.gallery__caption {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Results */
.project-results {
  padding: 6rem 0;
  background: var(--color-bg);
}

.project-results__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.result-card {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  transition: transform 0.3s var(--ease-out-expo);
}

.result-card:hover {
  transform: translateY(-8px);
}

.result-card__value {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 400;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.result-card__label {
  font-size: 1rem;
  color: var(--color-text-muted);
}

/* Project Navigation */
.project-nav {
  padding: 4rem 0 6rem;
  background: white;
}

.project-nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.project-nav__link {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 3rem;
  background: var(--color-bg);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s var(--ease-out-expo);
}

.project-nav__link:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.project-nav__link--next {
  text-align: right;
}

.project-nav__label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.project-nav__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-text);
}

/* Not Found */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 3rem;
}

.not-found h1 {
  font-family: var(--font-display);
  font-size: 2rem;
}

.btn-primary {
  padding: 1rem 2rem;
  background: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 100px;
  transition: all 0.3s var(--ease-out-expo);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);
}

/* Animations */
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

/* Responsive Design */

/* 平板 (768px - 1024px) */
@media (max-width: 1024px) {
  /* 容器 */
  .nav__container,
  .project-hero__container,
  .project-cover__container,
  .project-overview__container,
  .project-content__container,
  .project-gallery__container,
  .project-results__container,
  .project-nav__container {
    padding: 0 2rem;
  }

  /* Hero */
  .project-hero {
    padding: 8rem 0 3rem;
  }

  .project-hero__title {
    margin-bottom: 1.5rem;
  }

  .project-hero__description {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  /* 區段 */
  .project-cover,
  .project-overview,
  .project-content,
  .project-gallery,
  .project-results {
    padding: 5rem 0;
  }

  .project-nav {
    padding: 3rem 0 5rem;
  }

  /* Overview Grid */
  .project-overview__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  /* Gallery */
  .gallery {
    gap: 2.5rem;
  }

  /* Results */
  .results-grid {
    gap: 2.5rem;
  }
}

/* 手機橫向 / 小平板 (640px - 768px) */
@media (max-width: 768px) {
  /* 容器 */
  .nav__container,
  .project-hero__container,
  .project-cover__container,
  .project-overview__container,
  .project-content__container,
  .project-gallery__container,
  .project-results__container,
  .project-nav__container {
    padding: 0 1.5rem;
  }

  /* 導航 */
  .nav {
    padding: 1.5rem 0;
  }

  .nav__back {
    font-size: 0.875rem;
  }

  .nav__back svg {
    width: 18px;
    height: 18px;
  }

  .nav__logo {
    font-size: 1.25rem;
  }

  /* Hero */
  .project-hero {
    padding: 7rem 0 3rem;
  }

  .project-hero__meta {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .project-hero__description {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .project-hero__tags {
    gap: 0.5rem;
  }

  .tag {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }

  /* Cover */
  .project-cover {
    padding: 3rem 0;
  }

  .project-cover__image {
    border-radius: 12px;
  }

  .project-cover__label {
    font-size: 2rem;
  }

  /* Section Title */
  .section-title {
    margin-bottom: 1.25rem;
  }

  /* Overview */
  .project-overview,
  .project-content,
  .project-gallery,
  .project-results {
    padding: 4rem 0;
  }

  .project-overview__text {
    font-size: 1.0625rem;
  }

  .project-overview__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .project-overview__item {
    padding: 1.5rem 0;
  }

  /* Content */
  .project-content__container {
    gap: 4rem;
  }

  .project-content__text {
    font-size: 1.0625rem;
  }

  /* Gallery */
  .gallery {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2.5rem;
  }

  .gallery__item--full {
    grid-column: 1;
  }

  .gallery__label {
    font-size: 1.5rem;
  }

  .gallery__caption {
    font-size: 0.9375rem;
  }

  /* Results */
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2.5rem;
  }

  .result-card {
    padding: 2.5rem 1.5rem;
  }

  .result-card__value {
    font-size: 2.5rem;
  }

  .result-card__label {
    font-size: 0.9375rem;
  }

  /* Project Nav */
  .project-nav {
    padding: 3rem 0 4rem;
  }

  .project-nav__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .project-nav__link {
    padding: 2.5rem;
  }

  .project-nav__link--next {
    text-align: left;
  }

  .project-nav__title {
    font-size: 1.25rem;
  }
}

/* 手機直向 (< 640px) */
@media (max-width: 640px) {
  /* 容器 */
  .nav__container,
  .project-hero__container,
  .project-cover__container,
  .project-overview__container,
  .project-content__container,
  .project-gallery__container,
  .project-results__container,
  .project-nav__container {
    padding: 0 1.25rem;
  }

  /* Hero */
  .project-hero {
    padding: 6rem 0 2.5rem;
  }

  .project-hero__meta {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .project-hero__description {
    font-size: 1.0625rem;
  }

  /* 區段 */
  .project-overview,
  .project-content,
  .project-gallery,
  .project-results {
    padding: 3.5rem 0;
  }

  .project-cover {
    padding: 2.5rem 0;
  }

  /* Overview */
  .project-overview__text {
    font-size: 1rem;
  }

  .project-overview__item {
    padding: 1.25rem 0;
  }

  .project-overview__label {
    font-size: 0.8125rem;
    margin-bottom: 0.5rem;
  }

  .project-overview__value {
    font-size: 1rem;
  }

  /* Content */
  .project-content__container {
    gap: 3.5rem;
  }

  .project-content__text {
    font-size: 1rem;
  }

  /* Gallery */
  .gallery {
    gap: 1.75rem;
    margin-top: 2rem;
  }

  .gallery__image {
    border-radius: 8px;
    margin-bottom: 0.75rem;
  }

  .gallery__label {
    font-size: 1.25rem;
  }

  .gallery__caption {
    font-size: 0.875rem;
  }

  /* Results */
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .result-card {
    padding: 2rem 1.5rem;
  }

  .result-card__value {
    font-size: 2.25rem;
    margin-bottom: 0.375rem;
  }

  .result-card__label {
    font-size: 0.875rem;
  }

  /* Project Nav */
  .project-nav {
    padding: 2.5rem 0 3.5rem;
  }

  .project-nav__container {
    gap: 1.5rem;
  }

  .project-nav__link {
    padding: 2rem 1.5rem;
  }

  .project-nav__label {
    font-size: 0.8125rem;
  }

  .project-nav__title {
    font-size: 1.125rem;
  }

  /* Not Found */
  .not-found {
    padding: 2rem 1.25rem;
  }

  .not-found h1 {
    font-size: 1.5rem;
  }

  .btn-primary {
    padding: 0.875rem 1.75rem;
    font-size: 0.9375rem;
  }
}

/* 小手機 (< 480px) */
@media (max-width: 480px) {
  /* 容器 */
  .nav__container,
  .project-hero__container,
  .project-cover__container,
  .project-overview__container,
  .project-content__container,
  .project-gallery__container,
  .project-results__container,
  .project-nav__container {
    padding: 0 1rem;
  }

  /* 導航 */
  .nav {
    padding: 1.25rem 0;
  }

  .nav__back {
    font-size: 0.8125rem;
  }

  .nav__logo {
    font-size: 1.125rem;
  }

  /* Hero */
  .project-hero {
    padding: 5rem 0 2rem;
  }

  .project-hero__meta {
    font-size: 0.8125rem;
  }

  .tag {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  /* Cover */
  .project-cover {
    padding: 2rem 0;
  }

  .project-cover__image {
    border-radius: 8px;
  }

  .project-cover__label {
    font-size: 1.5rem;
  }

  /* 區段 */
  .project-overview,
  .project-content,
  .project-gallery,
  .project-results {
    padding: 3rem 0;
  }

  /* Gallery */
  .gallery {
    gap: 1.5rem;
  }

  .gallery__overlay svg {
    width: 36px;
    height: 36px;
  }

  /* Project Nav */
  .project-nav {
    padding: 2rem 0 3rem;
  }

  .project-nav__link {
    padding: 1.75rem 1.25rem;
  }

  .project-nav__title {
    font-size: 1rem;
  }
}
</style>
