<script setup lang="ts">
/**
 * 創意大膽主題
 * 特色：傾斜文字、漂浮幾何色塊、不規則瀑布流、側邊導航、非對稱設計
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

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="creative-theme">
    <!-- 漂浮幾何裝飾 -->
    <div class="floating-shapes">
      <div
        class="shape shape--circle"
        :style="{ transform: `translate(${mouseX * 2}px, ${mouseY * 2}px)` }"
      ></div>
      <div
        class="shape shape--square"
        :style="{ transform: `translate(${-mouseX * 1.5}px, ${-mouseY * 1.5}px) rotate(45deg)` }"
      ></div>
      <div
        class="shape shape--triangle"
        :style="{ transform: `translate(${mouseX}px, ${-mouseY}px)` }"
      ></div>
    </div>

    <!-- 側邊導航 -->
    <nav class="side-nav">
      <a href="#" class="side-nav__logo">{{ siteName.charAt(0) }}</a>
      <div class="side-nav__links">
        <a href="#work" class="side-nav__link">
          <span class="side-nav__link-text">WORK</span>
          <span class="side-nav__link-num">01</span>
        </a>
        <a href="#about" class="side-nav__link">
          <span class="side-nav__link-text">ABOUT</span>
          <span class="side-nav__link-num">02</span>
        </a>
        <a href="#contact" class="side-nav__link">
          <span class="side-nav__link-text">CONTACT</span>
          <span class="side-nav__link-num">03</span>
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <!-- Hero - 傾斜大標題 -->
      <section class="hero">
        <div class="hero__badge">
          <span>{{ profile?.title }}</span>
        </div>
        <h1 class="hero__title">
          <span class="hero__title-line" v-for="(word, i) in heroTitle.split(/[\n\s]+/)" :key="i">
            {{ word }}
          </span>
        </h1>
        <p class="hero__subtitle">{{ heroSubtitle.replace(/\n/g, ' ') }}</p>
        <a href="#work" class="hero__cta">
          <span>VIEW WORK</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </section>

      <!-- Work - 不規則瀑布流 -->
      <section id="work" class="work">
        <div class="work__header">
          <h2 class="work__title">SELECTED<br/>PROJECTS</h2>
          <span class="work__count">{{ String(projects?.length || 0).padStart(2, '0') }}</span>
        </div>

        <div class="work__grid">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/work/${project.id}`"
            class="project"
          >
            <div class="project__image" :style="{ background: project.color }">
              <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title" />
              <span v-else class="project__number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="project__info">
              <span class="project__category">{{ project.category }}</span>
              <h3 class="project__title">{{ project.title }}</h3>
            </div>
            <div class="project__arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- About - 非對稱排版 -->
      <section id="about" class="about">
        <div class="about__left">
          <h2 class="about__title">ABOUT<br/>ME</h2>
          <div class="about__photo" v-if="profile?.photo">
            <img :src="profile.photo" :alt="profile?.name" />
          </div>
        </div>

        <div class="about__right">
          <div class="about__bio">
            <p v-for="(p, i) in profile?.bio" :key="i" :class="{ 'about__bio--highlight': i === 0 }">
              {{ p }}
            </p>
          </div>

          <div class="about__skills">
            <h3>EXPERTISE</h3>
            <div class="skills-cloud">
              <template v-for="cat in skills" :key="cat.id">
                <span
                  v-for="skill in cat.skills"
                  :key="`${cat.id}-${skill}`"
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" class="contact">
        <div class="contact__content">
          <h2 class="contact__title">LET'S<br/>WORK<br/>TOGETHER</h2>
          <p class="contact__text">{{ contact?.text }}</p>
        </div>

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <span>© {{ new Date().getFullYear() }} {{ profile?.name }}</span>
        <span class="footer__made">Made with passion</span>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.creative-theme {
  --creative-orange: #ff6b35;
  --creative-orange-light: #ff9f7a;
  background: var(--color-bg);
  min-height: 100vh;
}

/* Floating Shapes */
.floating-shapes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  transition: transform 0.3s ease-out;
}

.shape--circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--creative-orange) 0%, transparent 70%);
  opacity: 0.15;
  top: 10%;
  right: 10%;
}

.shape--square {
  width: 200px;
  height: 200px;
  background: var(--creative-orange);
  opacity: 0.1;
  bottom: 20%;
  left: 15%;
}

.shape--triangle {
  width: 0;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 260px solid var(--creative-orange);
  opacity: 0.08;
  top: 50%;
  right: 30%;
}

/* Side Navigation */
.side-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: var(--color-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  z-index: 100;
}

.side-nav__logo {
  width: 48px;
  height: 48px;
  background: var(--creative-orange);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 3rem;
}

.side-nav__links {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.side-nav__link {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  transition: color 0.2s;
}

.side-nav__link:hover {
  color: var(--creative-orange);
}

.side-nav__link-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.side-nav__link-num {
  font-size: 0.625rem;
  opacity: 0.5;
}

/* Main Content */
.main {
  margin-left: 80px;
  position: relative;
  z-index: 1;
}

/* Hero */
.hero {
  min-height: 100vh;
  padding: 6rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero__badge {
  display: inline-flex;
  padding: 0.5rem 1.5rem;
  background: var(--creative-orange);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2rem;
  transform: rotate(-2deg);
}

.hero__title {
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 2rem;
}

.hero__title-line {
  display: block;
  transform-origin: left;
}

.hero__title-line:nth-child(odd) {
  transform: rotate(-1deg);
}

.hero__title-line:nth-child(even) {
  transform: rotate(1deg);
  color: var(--creative-orange);
}

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: var(--color-text);
  color: var(--color-bg);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  transition: all 0.3s;
}

.hero__cta svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.hero__cta:hover {
  background: var(--creative-orange);
  color: white;
}

.hero__cta:hover svg {
  transform: translate(4px, -4px);
}

/* Work */
.work {
  padding: 6rem 4rem;
}

.work__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4rem;
}

.work__title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.work__count {
  font-size: 6rem;
  font-weight: 800;
  color: var(--creative-orange);
  opacity: 0.3;
  line-height: 1;
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.project {
  text-decoration: none;
  color: inherit;
  position: relative;
}

.project__image {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project:hover .project__image img {
  transform: scale(1.1);
}

.project__number {
  font-size: 6rem;
  font-weight: 800;
  color: rgba(255,255,255,0.2);
}

.project__info {
  padding: 1.5rem 0;
}

.project__category {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--creative-orange);
}

.project__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.project__arrow {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  background: var(--creative-orange);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translate(-10px, 10px);
  transition: all 0.3s;
}

.project__arrow svg {
  width: 24px;
  height: 24px;
}

.project:hover .project__arrow {
  opacity: 1;
  transform: translate(0, 0);
}

/* About */
.about {
  padding: 6rem 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.about__title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 3rem;
}

.about__photo {
  max-width: 400px;
  transform: rotate(-3deg);
  box-shadow: 20px 20px 0 var(--creative-orange);
}

.about__photo img {
  width: 100%;
  display: block;
}

.about__bio p {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
}

.about__bio--highlight {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.about__skills {
  margin-top: 3rem;
}

.about__skills h3 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
}

.skills-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.875rem;
  font-weight: 500;
}

.skill-tag:nth-child(3n) {
  background: var(--creative-orange);
  color: white;
}

/* Contact */
.contact {
  padding: 6rem 4rem;
  background: var(--color-text);
  color: var(--color-bg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact__title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
}

.contact__text {
  font-size: 1.125rem;
  opacity: 0.7;
  margin-top: 2rem;
  line-height: 1.6;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact__link {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.contact__link:hover {
  background: var(--creative-orange);
}

.contact__link-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.5;
  width: 80px;
}

.contact__link-value {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
}

.contact__link svg {
  width: 24px;
  height: 24px;
  opacity: 0;
  transform: translate(-10px, 10px);
  transition: all 0.3s;
}

.contact__link:hover svg {
  opacity: 1;
  transform: translate(0, 0);
}

/* Footer */
.footer {
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.footer__made {
  color: var(--creative-orange);
}

/* Responsive */
@media (max-width: 1024px) {
  .work__grid {
    grid-template-columns: 1fr 1fr;
  }

  .project--0 { grid-column: span 1; }
  .project--1,
  .project--2 { margin-top: 0; }

  .about,
  .contact {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .side-nav {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    width: 100%;
    height: 70px;
    flex-direction: row;
    padding: 0 2rem;
  }

  .side-nav__logo {
    margin-bottom: 0;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .side-nav__links {
    flex-direction: row;
    gap: 1rem;
  }

  .side-nav__link {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .side-nav__link-num {
    display: none;
  }

  .main {
    margin-left: 0;
    padding-bottom: 70px;
  }

  .floating-shapes {
    display: none;
  }

  .work__grid {
    grid-template-columns: 1fr;
  }

  .hero,
  .work,
  .about,
  .contact,
  .footer {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
