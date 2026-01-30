<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectCard as ProjectCardType } from '~/types/api'
import type { ThemeConfig } from '~/types/database'

interface Props {
  project: ProjectCardType
  index: number
  theme: ThemeConfig
}

const props = defineProps<Props>()

const cardStyle = computed(() => props.theme.layout.cardStyle)
const projectsLayout = computed(() => props.theme.layout.projectsLayout)

// 格式化序號
const formattedIndex = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <NuxtLink
    :to="`/work/${project.id}`"
    class="project-card"
    :class="{
      'project-card--elevated': cardStyle === 'elevated',
      'project-card--flat': cardStyle === 'flat',
      'project-card--outlined': cardStyle === 'outlined',
      'project-card--glowing': cardStyle === 'glowing',
      'project-card--list': projectsLayout === 'list'
    }"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <div class="project-card__image">
      <div
        class="project-card__image-inner"
        :style="{ background: project.color }"
      >
        <img
          v-if="project.coverImage"
          :src="project.coverImage"
          :alt="project.title"
          class="project-card__cover"
          loading="lazy"
        />
        <span v-else class="project-card__number">{{ formattedIndex }}</span>
      </div>

      <!-- Glowing 效果的邊框 -->
      <div v-if="cardStyle === 'glowing'" class="project-card__glow-border"></div>
    </div>

    <div class="project-card__content">
      <div class="project-card__meta">
        <span class="project-card__category">{{ project.category }}</span>
        <span class="project-card__year">{{ project.year }}</span>
      </div>
      <h3 class="project-card__title">{{ project.title }}</h3>
      <p class="project-card__description">{{ project.description }}</p>
      <div class="project-card__tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* ==================== 基礎卡片樣式 ==================== */
.project-card {
  display: block;
  text-decoration: none;
  color: inherit;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
  transition: transform var(--animation-duration) var(--ease-out-expo),
    box-shadow var(--animation-duration) var(--ease-out-expo);
}

.project-card:hover {
  transform: var(--card-hover-transform);
}

.project-card__image {
  aspect-ratio: 16 / 10;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius-card);
  overflow: hidden;
  position: relative;
}

.project-card__image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s var(--ease-out-expo);
  position: relative;
  overflow: hidden;
}

.project-card:hover .project-card__image-inner {
  transform: scale(1.05);
}

.project-card__cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-expo);
}

.project-card:hover .project-card__cover {
  transform: scale(1.05);
}

.project-card__number {
  font-family: var(--font-display);
  font-size: 6rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 300;
}

.project-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.project-card__category {
  font-weight: 500;
}

.project-card__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.project-card__description {
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: var(--color-bg);
  font-size: 0.875rem;
  border-radius: var(--border-radius-button);
  color: var(--color-text-muted);
}

/* ==================== Elevated 樣式 ==================== */
.project-card--elevated {
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-card);
  overflow: hidden;
}

.project-card--elevated .project-card__image {
  margin-bottom: 0;
  border-radius: 0;
}

.project-card--elevated .project-card__content {
  padding: 1.5rem;
}

.project-card--elevated:hover {
  box-shadow: var(--card-hover-shadow);
}

/* ==================== Flat 樣式 ==================== */
.project-card--flat {
  background: transparent;
}

.project-card--flat .project-card__image {
  box-shadow: none;
}

.project-card--flat:hover {
  transform: none;
}

.project-card--flat:hover .project-card__title {
  color: var(--color-accent);
}

/* ==================== Outlined 樣式 ==================== */
.project-card--outlined {
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-card);
  padding: 1rem;
  background: var(--color-bg-secondary);
}

.project-card--outlined .project-card__image {
  margin-bottom: 1rem;
}

.project-card--outlined:hover {
  border-color: var(--color-accent);
}

/* ==================== Glowing 樣式 ==================== */
.project-card--glowing {
  position: relative;
}

.project-card--glowing .project-card__image {
  position: relative;
}

.project-card__glow-border {
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--border-radius-card) + 2px);
  background: linear-gradient(
    135deg,
    var(--color-accent) 0%,
    transparent 50%,
    var(--color-accent) 100%
  );
  opacity: 0;
  transition: opacity var(--animation-duration) ease;
  z-index: -1;
}

.project-card--glowing:hover .project-card__glow-border {
  opacity: 1;
  animation: glowPulse 2s ease-in-out infinite;
}

.project-card--glowing:hover {
  box-shadow: var(--card-hover-shadow);
}

/* ==================== List 佈局樣式 ==================== */
.project-card--list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.project-card--list .project-card__image {
  margin-bottom: 0;
  aspect-ratio: 16 / 10;
}

.project-card--list .project-card__content {
  padding: 0;
}

.project-card--list .project-card__title {
  font-size: 2rem;
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

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* ==================== 響應式設計 ==================== */
@media (max-width: 768px) {
  .project-card__image {
    margin-bottom: 1.25rem;
  }

  .project-card__title {
    font-size: 1.5rem;
  }

  .project-card__tags {
    gap: 0.375rem;
  }

  .tag {
    padding: 0.375rem 0.875rem;
    font-size: 0.8125rem;
  }

  /* List 佈局在手機版變成單欄 */
  .project-card--list {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem 0;
  }

  .project-card--list .project-card__title {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .project-card__meta {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .project-card__title {
    font-size: 1.375rem;
  }

  .project-card__description {
    font-size: 0.9375rem;
  }
}

@media (max-width: 480px) {
  .project-card__number {
    font-size: 4rem;
  }
}
</style>
