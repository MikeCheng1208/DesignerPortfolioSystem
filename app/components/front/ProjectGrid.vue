<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectCard as ProjectCardType } from '~/types/api'
import type { ThemeConfig } from '~/types/database'
import ProjectCard from './ProjectCard.vue'

interface Props {
  projects: ProjectCardType[]
  theme: ThemeConfig
}

const props = defineProps<Props>()

const projectsLayout = computed(() => props.theme.layout.projectsLayout)
const projectsColumns = computed(() => props.theme.layout.projectsColumns)

// 動態生成 grid-template-columns 的值
const gridColumnsStyle = computed(() => {
  if (projectsLayout.value === 'list') {
    return '1fr'
  }

  switch (projectsColumns.value) {
    case 1:
      return '1fr'
    case 2:
      return 'repeat(auto-fill, minmax(500px, 1fr))'
    case 3:
      return 'repeat(auto-fill, minmax(350px, 1fr))'
    default:
      return 'repeat(auto-fill, minmax(500px, 1fr))'
  }
})
</script>

<template>
  <section id="work" class="work">
    <div class="work__container">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">精選作品</h2>
      </div>

      <div
        class="work__grid"
        :class="{
          'work__grid--list': projectsLayout === 'list',
          'work__grid--1col': projectsColumns === 1 && projectsLayout === 'grid',
          'work__grid--2col': projectsColumns === 2 && projectsLayout === 'grid',
          'work__grid--3col': projectsColumns === 3 && projectsLayout === 'grid'
        }"
        :style="{ gridTemplateColumns: gridColumnsStyle }"
      >
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :index="index"
          :theme="theme"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.work {
  padding: var(--section-spacing) 0;
  background: var(--color-bg-secondary);
}

.work__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 5rem;
}

.section-number {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-text-muted);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.work__grid {
  display: grid;
  gap: 4rem 3rem;
}

/* Grid 佈局 */
.work__grid--1col {
  max-width: 800px;
}

.work__grid--2col {
  gap: 4rem 3rem;
}

.work__grid--3col {
  gap: 3rem 2rem;
}

/* List 佈局 */
.work__grid--list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ==================== 響應式設計 ==================== */
@media (max-width: 1200px) {
  .work__grid--2col,
  .work__grid--3col {
    grid-template-columns: 1fr !important;
    gap: 3rem;
  }
}

@media (max-width: 1024px) {
  .work__container {
    padding: 0 2rem;
  }

  .work {
    padding: calc(var(--section-spacing) * 0.75) 0;
  }

  .work__grid {
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .work__container {
    padding: 0 1.5rem;
  }

  .work {
    padding: calc(var(--section-spacing) * 0.625) 0;
  }

  .section-header {
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .section-number {
    font-size: 0.875rem;
  }

  .work__grid {
    gap: 2.5rem;
  }

  /* 側邊導航時預留底部空間 */
  body.nav-side & {
    padding-bottom: 90px;
  }
}

@media (max-width: 640px) {
  .work__container {
    padding: 0 1.25rem;
  }

  .work__grid {
    gap: 2rem;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }
}

@media (max-width: 480px) {
  .work__container {
    padding: 0 1rem;
  }
}
</style>
