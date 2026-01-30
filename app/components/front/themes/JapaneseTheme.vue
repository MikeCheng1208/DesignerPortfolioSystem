<script setup lang="ts">
/**
 * 日系清新主題
 * 特色：大量留白、橫向滾動畫廊、和風裝飾（圓形弧線）、緩慢動畫、分散式佈局
 */
import { ref, onMounted, onUnmounted } from 'vue'
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

const scrollContainer = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)

const handleScroll = () => {
  if (scrollContainer.value) {
    const el = scrollContainer.value
    scrollProgress.value = el.scrollLeft / (el.scrollWidth - el.clientWidth)
  }
}
</script>

<template>
  <div class="japanese-theme">
    <!-- 和風裝飾 -->
    <div class="decorations">
      <div class="deco-circle deco-circle--1"></div>
      <div class="deco-circle deco-circle--2"></div>
      <div class="deco-circle deco-circle--3"></div>
      <div class="deco-line deco-line--1"></div>
      <div class="deco-line deco-line--2"></div>
    </div>

    <!-- Navigation -->
    <nav class="nav">
      <a href="#" class="nav__logo">
        <span class="nav__logo-jp">作品集</span>
        <span class="nav__logo-en">{{ siteName }}</span>
      </a>
      <div class="nav__links">
        <a href="#work">作品</a>
        <a href="#about">紹介</a>
        <a href="#contact">連絡</a>
      </div>
    </nav>

    <!-- Hero - 分散式佈局 -->
    <section class="hero">
      <div class="hero__left">
        <p class="hero__label">{{ profile?.title }}</p>
        <div class="hero__vertical-text">
          <span v-for="char in heroTitle.replace(/\n/g, '')" :key="char">{{ char }}</span>
        </div>
      </div>

      <div class="hero__center">
        <div class="hero__circle">
          <span class="hero__circle-text">Portfolio</span>
        </div>
      </div>

      <div class="hero__right">
        <p class="hero__subtitle">{{ heroSubtitle.replace(/\n/g, '') }}</p>
        <a href="#work" class="hero__cta">
          <span>作品を見る</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- Work - 橫向滾動畫廊 -->
    <section id="work" class="work">
      <div class="work__header">
        <h2 class="work__title">
          <span class="work__title-jp">作品</span>
          <span class="work__title-en">Selected Works</span>
        </h2>
        <div class="work__progress">
          <div class="work__progress-bar" :style="{ width: scrollProgress * 100 + '%' }"></div>
        </div>
      </div>

      <div
        ref="scrollContainer"
        class="work__scroll"
        @scroll="handleScroll"
      >
        <div class="work__track">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/work/${project.id}`"
            class="project-card"
          >
            <div class="project-card__image" :style="{ background: project.color }">
              <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title" />
              <span v-else class="project-card__number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="project-card__content">
              <span class="project-card__index">No.{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__category">{{ project.category }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <p class="work__hint">← スクロールして閲覧 →</p>
    </section>

    <!-- About -->
    <section id="about" class="about">
      <div class="about__container">
        <div class="about__header">
          <h2 class="about__title">
            <span class="about__title-jp">紹介</span>
            <span class="about__title-en">About Me</span>
          </h2>
        </div>

        <div class="about__content">
          <div class="about__photo-wrapper">
            <div class="about__photo-frame">
              <img v-if="profile?.photo" :src="profile.photo" :alt="profile?.name" />
              <div v-else class="about__photo-placeholder"></div>
            </div>
            <p class="about__name">{{ profile?.name }}</p>
          </div>

          <div class="about__bio">
            <p v-for="(p, i) in profile?.bio" :key="i" :class="{ 'about__bio--first': i === 0 }">
              {{ p }}
            </p>
          </div>

          <div class="about__skills">
            <div v-for="cat in skills" :key="cat.id" class="skill-category">
              <h3>{{ cat.title }}</h3>
              <div class="skill-list">
                <span v-for="skill in cat.skills" :key="skill">{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact">
      <div class="contact__container">
        <h2 class="contact__title">
          <span class="contact__title-jp">連絡</span>
          <span class="contact__title-en">Get in Touch</span>
        </h2>

        <p class="contact__text">{{ contact?.text }}</p>

        <div class="contact__links">
          <a
            v-for="link in contact?.links"
            :key="link.id"
            :href="link.url"
            class="contact__link"
            :target="link.id !== 'email' ? '_blank' : undefined"
          >
            <span class="contact__link-circle"></span>
            <div class="contact__link-content">
              <span class="contact__link-label">{{ link.label }}</span>
              <span class="contact__link-value">{{ link.value }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__content">
        <span>© {{ new Date().getFullYear() }} {{ profile?.name }}</span>
        <div class="footer__circle"></div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.japanese-theme {
  --jp-pink: #e8a4a0;
  --jp-pink-light: #f5d5d3;
  --jp-beige: #f9f6f0;
  font-weight: 300;
  background: var(--jp-beige);
  color: #2d2d2d;
}

/* Decorations */
.decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--jp-pink-light);
}

.deco-circle--1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
}

.deco-circle--2 {
  width: 300px;
  height: 300px;
  bottom: 20%;
  left: -100px;
}

.deco-circle--3 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  background: var(--jp-pink-light);
  opacity: 0.3;
}

.deco-line {
  position: absolute;
  background: var(--jp-pink-light);
}

.deco-line--1 {
  width: 1px;
  height: 200px;
  top: 20%;
  left: 10%;
}

.deco-line--2 {
  width: 100px;
  height: 1px;
  bottom: 30%;
  right: 5%;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__logo {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.nav__logo-jp {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--jp-pink);
}

.nav__logo-en {
  font-size: 1.25rem;
  font-weight: 400;
}

.nav__links {
  display: flex;
  gap: 3rem;
}

.nav__links a {
  font-size: 0.875rem;
  color: inherit;
  text-decoration: none;
  letter-spacing: 0.1em;
  opacity: 0.6;
  transition: all 0.5s ease;
}

.nav__links a:hover {
  opacity: 1;
  color: var(--jp-pink);
}

/* Hero */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 6rem 4rem;
  position: relative;
}

.hero__left {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
}

.hero__vertical-text {
  writing-mode: vertical-rl;
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  line-height: 2;
}

.hero__center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__circle {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 1px solid var(--jp-pink);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.hero__circle-text {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--jp-pink);
}

.hero__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 3rem;
}

.hero__subtitle {
  font-size: 1rem;
  line-height: 2;
  max-width: 300px;
  color: #7a7a7a;
}

.hero__cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.hero__cta:hover {
  color: var(--jp-pink);
}

.hero__cta svg {
  width: 24px;
  height: 24px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

/* Work */
.work {
  padding: 6rem 0;
  position: relative;
}

.work__header {
  padding: 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.work__title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.work__title-jp {
  font-size: 2rem;
  font-weight: 400;
}

.work__title-en {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
}

.work__progress {
  width: 100px;
  height: 2px;
  background: var(--jp-pink-light);
  margin-bottom: 0.5rem;
}

.work__progress-bar {
  height: 100%;
  background: var(--jp-pink);
  transition: width 0.1s;
}

.work__scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.work__scroll::-webkit-scrollbar {
  display: none;
}

.work__track {
  display: flex;
  gap: 3rem;
  padding: 2rem 4rem;
}

.project-card {
  flex-shrink: 0;
  width: 400px;
  text-decoration: none;
  color: inherit;
}

.project-card__image {
  aspect-ratio: 4/5;
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s ease;
}

.project-card:hover .project-card__image img {
  transform: scale(1.05);
}

.project-card__number {
  font-size: 4rem;
  font-weight: 200;
  color: rgba(255,255,255,0.3);
}

.project-card__content {
  padding: 0 1rem;
}

.project-card__index {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
}

.project-card__title {
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0.5rem 0;
}

.project-card__category {
  font-size: 0.75rem;
  color: #7a7a7a;
}

.work__hint {
  text-align: center;
  font-size: 0.75rem;
  color: #7a7a7a;
  margin-top: 2rem;
  letter-spacing: 0.2em;
}

/* About */
.about {
  padding: 8rem 0;
}

.about__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

.about__header {
  text-align: center;
  margin-bottom: 5rem;
}

.about__title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.about__title-jp {
  font-size: 2rem;
  font-weight: 400;
}

.about__title-en {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
}

.about__content {
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  gap: 4rem;
}

.about__photo-wrapper {
  text-align: center;
}

.about__photo-frame {
  padding: 1rem;
  background: white;
  margin-bottom: 1rem;
}

.about__photo-frame img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.about__photo-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: var(--jp-pink-light);
}

.about__name {
  font-size: 0.875rem;
  color: #7a7a7a;
}

.about__bio p {
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 1.5rem;
  color: #7a7a7a;
}

.about__bio--first {
  font-size: 1.25rem;
  color: #2d2d2d;
}

.skill-category {
  margin-bottom: 2rem;
}

.skill-category h3 {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
  margin-bottom: 1rem;
  font-weight: 400;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-list span {
  padding: 0.5rem 1rem;
  background: white;
  font-size: 0.75rem;
  border-radius: 100px;
}

/* Contact */
.contact {
  padding: 8rem 0;
  background: white;
}

.contact__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 4rem;
  text-align: center;
}

.contact__title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.contact__title-jp {
  font-size: 2rem;
  font-weight: 400;
}

.contact__title-en {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--jp-pink);
}

.contact__text {
  font-size: 1rem;
  color: #7a7a7a;
  line-height: 2;
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
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.5s;
}

.contact__link:hover {
  background: var(--jp-beige);
}

.contact__link-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--jp-pink);
}

.contact__link-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.contact__link-label {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7a7a7a;
}

.contact__link-value {
  font-size: 1rem;
}

/* Footer */
.footer {
  padding: 3rem 4rem;
  border-top: 1px solid var(--jp-pink-light);
}

.footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #7a7a7a;
}

.footer__circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--jp-pink-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
  }

  .hero__left,
  .hero__right {
    align-items: center;
    text-align: center;
  }

  .hero__vertical-text {
    writing-mode: horizontal-tb;
  }

  .about__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about__photo-wrapper {
    order: -1;
  }

  .about__photo-frame {
    max-width: 200px;
    margin: 0 auto 1rem;
  }
}

@media (max-width: 768px) {
  .nav,
  .work__header,
  .work__track,
  .about__container,
  .contact__container,
  .footer {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .hero {
    padding: 6rem 2rem;
  }

  .project-card {
    width: 300px;
  }

  .nav__links {
    gap: 1.5rem;
  }

  .decorations {
    display: none;
  }
}
</style>
