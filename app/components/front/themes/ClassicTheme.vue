<script setup lang="ts">
/**
 * 經典優雅主題
 * 特色：精緻襯線字體、相框式卡片、裝飾線條、優雅分隔符
 */
import { computed } from 'vue'
import type { Profile, ProjectCard, SkillCategory, ContactInfo } from '~/types/api'

interface Props {
  profile: Profile | null
  projects: ProjectCard[] | null
  skills: SkillCategory[] | null
  contact: ContactInfo | null
  siteName: string
  heroTitle: string
  heroSubtitle: string
}

const props = defineProps<Props>()

const heroTitleLines = computed(() => props.heroTitle.split('\n'))
</script>

<template>
  <div class="classic-theme">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav__container">
        <a href="#" class="nav__logo">{{ siteName }}</a>
        <div class="nav__links">
          <a href="#work" class="nav__link">作品</a>
          <span class="nav__divider">·</span>
          <a href="#about" class="nav__link">關於</a>
          <span class="nav__divider">·</span>
          <a href="#contact" class="nav__link">聯絡</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section - 經典置中排版 -->
    <section class="hero">
      <div class="hero__decoration hero__decoration--top"></div>
      <div class="hero__container">
        <p class="hero__label">{{ profile?.title || 'Designer' }}</p>
        <h1 class="hero__title">
          <span v-for="(line, i) in heroTitleLines" :key="i" class="hero__title-line">
            {{ line }}
          </span>
        </h1>
        <div class="hero__divider">
          <span></span>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/></svg>
          <span></span>
        </div>
        <p class="hero__subtitle">{{ heroSubtitle.replace(/\n/g, ' ') }}</p>
        <a href="#work" class="hero__cta">探索作品集</a>
      </div>
      <div class="hero__decoration hero__decoration--bottom"></div>
    </section>

    <!-- Work Section - 相框式卡片 -->
    <section id="work" class="work">
      <div class="work__container">
        <div class="section-header">
          <div class="section-header__line"></div>
          <h2 class="section-header__title">精選作品</h2>
          <div class="section-header__line"></div>
        </div>

        <div class="work__grid">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/work/${project.id}`"
            class="project-card"
          >
            <div class="project-card__frame">
              <div class="project-card__image" :style="{ background: project.color }">
                <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title" />
                <span v-else class="project-card__number">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
            </div>
            <div class="project-card__content">
              <span class="project-card__category">{{ project.category }} · {{ project.year }}</span>
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__description">{{ project.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="about__container">
        <div class="section-header">
          <div class="section-header__line"></div>
          <h2 class="section-header__title">關於我</h2>
          <div class="section-header__line"></div>
        </div>

        <div class="about__content">
          <div class="about__photo">
            <div class="about__photo-frame">
              <img v-if="profile?.photo" :src="profile.photo" :alt="profile?.name" />
              <div v-else class="about__photo-placeholder"></div>
            </div>
            <p class="about__name">{{ profile?.name }}</p>
          </div>

          <div class="about__bio">
            <p v-for="(p, i) in profile?.bio" :key="i" :class="{ 'about__bio--first': i === 0 }">{{ p }}</p>
          </div>

          <div class="about__skills">
            <div v-for="cat in skills" :key="cat.id" class="skill-group">
              <h3>{{ cat.title }}</h3>
              <ul>
                <li v-for="skill in cat.skills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="contact__container">
        <div class="section-header section-header--light">
          <div class="section-header__line"></div>
          <h2 class="section-header__title">聯絡我</h2>
          <div class="section-header__line"></div>
        </div>

        <p class="contact__text">{{ contact?.text }}</p>

        <div class="contact__links">
          <a
            v-for="link in contact?.links"
            :key="link.id"
            :href="link.url"
            class="contact__link"
            :target="link.id !== 'email' ? '_blank' : undefined"
          >
            <span class="contact__link-label">{{ link.label }}</span>
            <span class="contact__link-value">{{ link.value }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__ornament">❧</div>
      <p>© {{ new Date().getFullYear() }} {{ profile?.name }}. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.classic-theme {
  --classic-gold: #c9a227;
  --classic-navy: #1e3a5f;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.5rem 0;
  background: linear-gradient(to bottom, var(--color-bg), transparent);
}

.nav__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__logo {
  font-family: var(--font-display);
  font-size: 1.75rem;
  color: var(--color-text);
  text-decoration: none;
  font-style: italic;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav__link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.3s;
}

.nav__link:hover {
  color: var(--classic-gold);
}

.nav__divider {
  color: var(--color-border);
}

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  position: relative;
}

.hero__decoration {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, var(--color-border), transparent);
}

.hero__decoration--top { top: 2rem; }
.hero__decoration--bottom { bottom: 2rem; }

.hero__container {
  max-width: 800px;
}

.hero__label {
  font-size: 0.875rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--classic-gold);
  margin-bottom: 2rem;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.2;
  margin-bottom: 2rem;
}

.hero__title-line {
  display: block;
}

.hero__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  color: var(--classic-gold);
}

.hero__divider span {
  width: 60px;
  height: 1px;
  background: currentColor;
}

.hero__divider svg {
  width: 16px;
  height: 16px;
}

.hero__subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 3rem;
}

.hero__cta {
  display: inline-block;
  padding: 1rem 3rem;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all 0.3s;
}

.hero__cta:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
}

.section-header__line {
  width: 100px;
  height: 1px;
  background: var(--color-border);
}

.section-header__title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  font-style: italic;
  white-space: nowrap;
}

.section-header--light .section-header__line {
  background: rgba(255,255,255,0.3);
}

.section-header--light .section-header__title {
  color: white;
}

/* Work Section */
.work {
  padding: 6rem 0;
  background: var(--color-bg-secondary);
}

.work__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

.project-card {
  text-decoration: none;
  color: inherit;
}

.project-card__frame {
  padding: 1rem;
  background: var(--color-bg);
  box-shadow:
    0 0 0 1px var(--color-border),
    8px 8px 0 var(--color-border);
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
}

.project-card:hover .project-card__frame {
  box-shadow:
    0 0 0 1px var(--classic-gold),
    12px 12px 0 var(--classic-gold);
}

.project-card__image {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .project-card__image img {
  transform: scale(1.05);
}

.project-card__number {
  font-family: var(--font-display);
  font-size: 4rem;
  color: rgba(255,255,255,0.3);
  font-style: italic;
}

.project-card__category {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.project-card__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  margin: 0.5rem 0;
}

.project-card__description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* About Section */
.about {
  padding: 6rem 0;
  background: var(--color-bg);
}

.about__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about__content {
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about__photo-frame {
  padding: 0.75rem;
  background: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-border);
}

.about__photo-frame img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(30%);
}

.about__photo-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: var(--color-bg-secondary);
}

.about__name {
  text-align: center;
  margin-top: 1rem;
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-text-muted);
}

.about__bio p {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: var(--color-text-muted);
}

.about__bio--first {
  font-size: 1.25rem;
  color: var(--color-text);
  font-family: var(--font-display);
  font-style: italic;
}

.skill-group {
  margin-bottom: 2rem;
}

.skill-group h3 {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: var(--classic-gold);
}

.skill-group ul {
  list-style: none;
}

.skill-group li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* Contact Section */
.contact {
  padding: 6rem 0;
  background: var(--classic-navy);
  color: white;
}

.contact__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.contact__text {
  font-size: 1.25rem;
  line-height: 1.8;
  opacity: 0.8;
  margin-bottom: 3rem;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.contact__link {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  text-decoration: none;
  color: white;
  transition: all 0.3s;
}

.contact__link:hover {
  border-color: var(--classic-gold);
}

.contact__link-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.contact__link-value {
  font-family: var(--font-display);
  font-style: italic;
}

/* Footer */
.footer {
  padding: 3rem 2rem;
  text-align: center;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.footer__ornament {
  font-size: 1.5rem;
  color: var(--classic-gold);
  margin-bottom: 1rem;
}

.footer p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .about__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about__photo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .about__photo-frame {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .work__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .nav__links {
    gap: 1rem;
  }

  .nav__divider {
    display: none;
  }
}
</style>
