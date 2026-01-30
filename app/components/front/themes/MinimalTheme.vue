<script setup lang="ts">
/**
 * 現代極簡主題 - 高級優雅版
 * 特色：精緻留白、大圖卡片、優雅動畫、高級感配色
 */
import { ref, onMounted } from 'vue'
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

// 頁面載入動畫
const isLoaded = ref(false)
const visibleSections = ref<Set<string>>(new Set())

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)

  // Intersection Observer 用於區塊淡入
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.value.add(entry.target.id)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.minimal-theme section[id]').forEach((section) => {
    observer.observe(section)
  })
})

// 格式化標題，保留換行
const formatTitle = (text: string) => {
  return text.split('\n')
}
</script>

<template>
  <div class="minimal-theme" :class="{ 'is-loaded': isLoaded }">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav__inner">
        <a href="#" class="nav__logo">{{ siteName }}</a>
        <div class="nav__links">
          <a href="#work">作品</a>
          <a href="#about">關於</a>
          <a href="#contact">聯絡</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero__content">
        <p class="hero__label">Portfolio</p>
        <h1 class="hero__title">
          <span v-for="(line, i) in formatTitle(heroTitle)" :key="i" class="hero__title-line">
            {{ line }}
          </span>
        </h1>
        <p class="hero__subtitle">{{ heroSubtitle.replace(/\n/g, ' ') }}</p>
      </div>
      <div class="hero__scroll-hint">
        <span>探索作品</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </section>

    <!-- Work -->
    <section id="work" class="work" :class="{ 'is-visible': visibleSections.has('work') }">
      <div class="section-header">
        <span class="section-label">Selected Work</span>
        <h2 class="section-title">精選作品</h2>
      </div>

      <div class="work__grid">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="project.id"
          :to="`/work/${project.id}`"
          class="work__card"
        >
          <div class="work__card-image">
            <img
              v-if="project.coverImage"
              :src="project.coverImage"
              :alt="project.title"
              loading="lazy"
            />
            <div v-else class="work__card-placeholder" :style="{ background: project.color || '#f5f5f0' }"></div>
            <div class="work__card-overlay"></div>
          </div>
          <div class="work__card-content">
            <span class="work__card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="work__card-title">{{ project.title }}</h3>
            <div class="work__card-meta">
              <span>{{ project.category }}</span>
              <span class="work__card-divider">·</span>
              <span>{{ project.year }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="about" :class="{ 'is-visible': visibleSections.has('about') }">
      <div class="section-header">
        <span class="section-label">About Me</span>
        <h2 class="section-title">關於我</h2>
      </div>

      <div class="about__content">
        <div class="about__main">
          <div class="about__photo" v-if="profile?.photo">
            <img :src="profile.photo" :alt="profile?.name" />
          </div>
          <div class="about__intro">
            <p class="about__role">{{ profile?.title }}</p>
            <div class="about__bio">
              <p v-for="(p, i) in profile?.bio" :key="i">{{ p }}</p>
            </div>
          </div>
        </div>

        <div class="about__skills">
          <h3 class="about__skills-title">專業技能</h3>
          <div class="skills-grid">
            <div v-for="cat in skills" :key="cat.id" class="skill-category">
              <h4>{{ cat.title }}</h4>
              <ul>
                <li v-for="skill in cat.skills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact" :class="{ 'is-visible': visibleSections.has('contact') }">
      <div class="contact__inner">
        <div class="section-header section-header--center">
          <span class="section-label">Get in Touch</span>
          <h2 class="section-title">開始合作</h2>
        </div>

        <p class="contact__text">{{ contact?.text }}</p>

        <div class="contact__links">
          <a
            v-for="link in contact?.links"
            :key="link.id"
            :href="link.url"
            :target="link.id !== 'email' ? '_blank' : undefined"
            class="contact__link"
          >
            <span class="contact__link-label">{{ link.label }}</span>
            <span class="contact__link-value">{{ link.value }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__inner">
        <span>© {{ new Date().getFullYear() }} {{ profile?.name }}</span>
        <span class="footer__credit">Crafted with care</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.minimal-theme {
  --color-cream: #faf9f7;
  --color-warm-white: #ffffff;
  --color-charcoal: #1a1a1a;
  --color-charcoal-light: #2d2d2d;
  --color-stone: #8a8a8a;
  --color-stone-light: #b5b5b5;
  --color-border: #e8e6e3;
  --color-border-dark: #d4d2cf;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif;
  background: var(--color-cream);
  color: var(--color-charcoal);
  line-height: 1.6;
}

/* Utilities */
.section-header {
  margin-bottom: 4rem;
}

.section-header--center {
  text-align: center;
}

.section-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-charcoal);
}

/* Page Load Animation */
.minimal-theme {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.minimal-theme.is-loaded {
  opacity: 1;
}

/* Section Reveal Animation */
section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

section.is-visible,
.hero {
  opacity: 1;
  transform: translateY(0);
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
  background: rgba(250, 249, 247, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.nav__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__logo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-charcoal);
  text-decoration: none;
  letter-spacing: -0.01em;
}

.nav__links {
  display: flex;
  gap: 2.5rem;
}

.nav__links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-stone);
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav__links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--color-charcoal);
  transition: width 0.3s ease;
}

.nav__links a:hover {
  color: var(--color-charcoal);
}

.nav__links a:hover::after {
  width: 100%;
}

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8rem clamp(1.5rem, 5vw, 4rem) 4rem;
  position: relative;
  opacity: 1;
  transform: none;
}

.hero__content {
  max-width: 900px;
}

.hero__label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin-bottom: 2rem;
}

.hero__title {
  margin-bottom: 2rem;
}

.hero__title-line {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-charcoal);
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-stone);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.hero__scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-stone-light);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  animation: float 2s ease-in-out infinite;
}

.hero__scroll-hint svg {
  opacity: 0.6;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* Work Section */
.work {
  padding: 8rem clamp(1.5rem, 5vw, 4rem);
  background: var(--color-warm-white);
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.work__card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--color-cream);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.work__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.work__card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.work__card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.work__card:hover .work__card-image img {
  transform: scale(1.05);
}

.work__card-placeholder {
  width: 100%;
  height: 100%;
}

.work__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.03) 100%);
}

.work__card-content {
  padding: 1.75rem 2rem;
}

.work__card-index {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-stone-light);
  margin-bottom: 0.5rem;
}

.work__card-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  color: var(--color-charcoal);
}

.work__card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-stone);
}

.work__card-divider {
  opacity: 0.5;
}

/* About Section */
.about {
  padding: 8rem clamp(1.5rem, 5vw, 4rem);
  background: var(--color-cream);
}

.about__content {
  max-width: 1200px;
  margin: 0 auto;
}

.about__main {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4rem;
  margin-bottom: 5rem;
}

.about__photo {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.about__photo img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  filter: grayscale(15%);
  transition: filter 0.4s ease;
}

.about__photo:hover img {
  filter: grayscale(0%);
}

.about__intro {
  padding-top: 0.5rem;
}

.about__role {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-stone);
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.about__bio p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-charcoal-light);
  margin-bottom: 1.5rem;
}

.about__bio p:first-child {
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--color-charcoal);
  line-height: 1.6;
}

.about__skills {
  padding-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.about__skills-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-charcoal);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
}

.skill-category h4 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin-bottom: 1rem;
}

.skill-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-category li {
  font-size: 0.9375rem;
  color: var(--color-charcoal-light);
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--color-border);
}

.skill-category li:last-child {
  border-bottom: none;
}

/* Contact Section */
.contact {
  padding: 8rem clamp(1.5rem, 5vw, 4rem);
  background: var(--color-charcoal);
  color: var(--color-warm-white);
}

.contact .section-label {
  color: var(--color-stone-light);
}

.contact .section-title {
  color: var(--color-warm-white);
}

.contact__inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.contact__text {
  font-size: 1.125rem;
  color: var(--color-stone-light);
  line-height: 1.8;
  margin-bottom: 3rem;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.contact__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  min-width: 280px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.contact__link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.contact__link-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-stone-light);
  margin-bottom: 0.25rem;
}

.contact__link-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-warm-white);
}

/* Footer */
.footer {
  padding: 2rem clamp(1.5rem, 5vw, 4rem);
  background: var(--color-charcoal);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-stone);
}

.footer__credit {
  font-style: italic;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .work__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .about__main {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .about__photo {
    position: static;
    max-width: 200px;
    margin: 0 auto;
  }

  .about__intro {
    text-align: center;
  }

  .about__bio p {
    text-align: left;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .nav__inner {
    padding: 1rem 0;
  }

  .nav__links {
    gap: 1.5rem;
  }

  .nav__links a {
    font-size: 0.8125rem;
  }

  .hero {
    min-height: calc(100vh - 60px);
    padding-top: 6rem;
  }

  .hero__title-line {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .hero__scroll-hint {
    display: none;
  }

  .work,
  .about,
  .contact {
    padding: 5rem clamp(1.5rem, 5vw, 4rem);
  }

  .section-header {
    margin-bottom: 2.5rem;
  }

  .work__card-content {
    padding: 1.25rem 1.5rem;
  }

  .work__card-title {
    font-size: 1.25rem;
  }

  .about__photo {
    max-width: 160px;
  }

  .about__bio p {
    font-size: 1rem;
  }

  .about__bio p:first-child {
    font-size: 1.125rem;
  }

  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .contact__link {
    width: 100%;
    min-width: auto;
  }

  .footer__inner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

/* Responsive - Small Mobile */
@media (max-width: 480px) {
  .nav__links {
    gap: 1rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
