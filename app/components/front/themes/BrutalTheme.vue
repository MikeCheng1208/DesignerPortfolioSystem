<script setup lang="ts">
/**
 * 野獸派主題 (Brutal Theme)
 * 特色：高對比配色、粗暴排版、故障藝術標題特效、打破常規的視覺衝擊
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

// 標題動畫狀態
const titleChars = ref<string[]>([])
const isGlitching = ref(false)
const glitchText = ref('')
const mousePos = ref({ x: 0, y: 0 })

// 隨機字符集
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// 初始化標題字符
onMounted(() => {
  const title = props.heroTitle.replace(/\n/g, ' ')
  titleChars.value = title.split('')
  glitchText.value = title

  // 啟動 Glitch 效果循環
  startGlitchLoop()

  // 監聽滑鼠移動
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

// 滑鼠移動處理
const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

// Glitch 效果循環
let glitchInterval: ReturnType<typeof setInterval> | null = null
const startGlitchLoop = () => {
  // 每隔一段時間觸發 glitch
  setInterval(() => {
    triggerGlitch()
  }, 3000 + Math.random() * 2000)
}

// 觸發 Glitch 效果
const triggerGlitch = () => {
  if (isGlitching.value) return
  isGlitching.value = true

  const originalText = props.heroTitle.replace(/\n/g, ' ')
  let iterations = 0
  const maxIterations = 10

  glitchInterval = setInterval(() => {
    glitchText.value = originalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (Math.random() < 0.3) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      })
      .join('')

    iterations++
    if (iterations >= maxIterations) {
      if (glitchInterval) clearInterval(glitchInterval)
      glitchText.value = originalText
      isGlitching.value = false
    }
  }, 50)
}

// 計算字符動畫延遲
const getCharDelay = (index: number) => {
  return `${index * 0.05}s`
}

// 計算字符隨機旋轉
const getCharRotation = (index: number) => {
  const seed = index * 13 % 7
  return `${(seed - 3) * 2}deg`
}
</script>

<template>
  <div class="brutal-theme">
    <!-- 噪點背景 -->
    <div class="noise-overlay"></div>

    <!-- Navigation -->
    <nav class="nav">
      <a href="#" class="nav__logo">
        <span class="nav__logo-text">{{ siteName }}</span>
        <span class="nav__logo-shadow">{{ siteName }}</span>
      </a>
      <div class="nav__links">
        <a href="#work">WORK</a>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
      </div>
    </nav>

    <!-- Hero - 衝擊視覺 -->
    <section class="hero">
      <div class="hero__bg-text">DESIGN</div>

      <div class="hero__content">
        <div class="hero__label">
          <span class="hero__label-line"></span>
          <span>{{ profile?.title || 'CREATIVE' }}</span>
          <span class="hero__label-line"></span>
        </div>

        <!-- 主標題 - Glitch 效果 -->
        <h1 class="hero__title" :class="{ 'is-glitching': isGlitching }">
          <span class="hero__title-main" :data-text="glitchText">{{ glitchText }}</span>
          <span class="hero__title-shadow">{{ glitchText }}</span>
          <span class="hero__title-highlight">{{ glitchText }}</span>
        </h1>

        <p class="hero__subtitle">{{ heroSubtitle.replace(/\n/g, ' ') }}</p>

        <div class="hero__cta">
          <a href="#work" class="hero__cta-btn">
            <span>VIEW WORK</span>
            <span class="hero__cta-arrow">→</span>
          </a>
        </div>
      </div>

      <!-- 裝飾元素 -->
      <div class="hero__decor hero__decor--1"></div>
      <div class="hero__decor hero__decor--2"></div>
      <div class="hero__decor hero__decor--3"></div>

      <div class="hero__scroll">
        <span>SCROLL</span>
        <div class="hero__scroll-line"></div>
      </div>
    </section>

    <!-- Work Section -->
    <section id="work" class="work">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-title-main">SELECTED</span>
          <span class="section-title-outline">WORK</span>
        </h2>
        <span class="section-count">({{ String(projects?.length || 0).padStart(2, '0') }})</span>
      </div>

      <div class="work__grid">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="project.id"
          :to="`/work/${project.id}`"
          class="project"
        >
          <div class="project__index">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="project__image" :style="{ background: project.color }">
            <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title" />
            <div class="project__image-overlay"></div>
          </div>
          <div class="project__info">
            <span class="project__category">[ {{ project.category }} ]</span>
            <h3 class="project__title">{{ project.title }}</h3>
            <span class="project__year">{{ project.year }}</span>
          </div>
          <div class="project__hover-text">VIEW →</div>
        </NuxtLink>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="about__header">
        <h2 class="section-title">
          <span class="section-title-main">ABOUT</span>
          <span class="section-title-outline">ME</span>
        </h2>
      </div>

      <div class="about__content">
        <div class="about__left">
          <div class="about__photo" v-if="profile?.photo">
            <img :src="profile.photo" :alt="profile?.name" />
            <div class="about__photo-frame"></div>
          </div>
          <div class="about__name">{{ profile?.name }}</div>
        </div>

        <div class="about__right">
          <div class="about__bio">
            <p v-for="(p, i) in profile?.bio" :key="i" :class="{ 'about__bio--first': i === 0 }">
              {{ p }}
            </p>
          </div>

          <div class="about__skills">
            <div v-for="cat in skills" :key="cat.id" class="skill-block">
              <h3 class="skill-block__title">{{ cat.title }}</h3>
              <div class="skill-block__list">
                <span v-for="skill in cat.skills" :key="skill" class="skill-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="contact__inner">
        <h2 class="contact__title">
          <span class="contact__title-line">LET'S</span>
          <span class="contact__title-line contact__title-line--outline">WORK</span>
          <span class="contact__title-line">TOGETHER</span>
        </h2>

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
            <span class="contact__link-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__inner">
        <span class="footer__copy">© {{ new Date().getFullYear() }}</span>
        <span class="footer__name">{{ profile?.name }}</span>
        <span class="footer__tagline">NO RULES. JUST DESIGN.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.brutal-theme {
  --brutal-black: #0a0a0a;
  --brutal-white: #ffffff;
  --brutal-yellow: #ffff00;
  --brutal-red: #ff0000;
  --brutal-blue: #0000ff;
  --brutal-green: #00ff00;

  background: var(--brutal-black);
  color: var(--brutal-white);
  font-family: 'Arial Black', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
}

/* Noise Overlay */
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
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
  mix-blend-mode: difference;
}

.nav__logo {
  position: relative;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.05em;
}

.nav__logo-text {
  color: var(--brutal-white);
  position: relative;
  z-index: 1;
}

.nav__logo-shadow {
  position: absolute;
  top: 2px;
  left: 2px;
  color: var(--brutal-yellow);
  z-index: 0;
}

.nav__links {
  display: flex;
  gap: 3rem;
}

.nav__links a {
  color: var(--brutal-white);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  position: relative;
  transition: color 0.2s;
}

.nav__links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--brutal-yellow);
  transition: width 0.3s ease;
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
  padding: 8rem 4rem;
  position: relative;
  overflow: hidden;
}

.hero__bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(15rem, 40vw, 50rem);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: -0.05em;
}

.hero__content {
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 1200px;
}

.hero__label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: var(--brutal-yellow);
}

.hero__label-line {
  width: 60px;
  height: 2px;
  background: var(--brutal-yellow);
}

/* 主標題 Glitch 效果 */
.hero__title {
  position: relative;
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.hero__title-main {
  position: relative;
  display: block;
  color: var(--brutal-white);
}

.hero__title-main::before,
.hero__title-main::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.hero__title-main::before {
  color: var(--brutal-red);
  animation: glitch-1 3s infinite linear alternate-reverse;
}

.hero__title-main::after {
  color: var(--brutal-blue);
  animation: glitch-2 2s infinite linear alternate-reverse;
}

.hero__title-shadow {
  position: absolute;
  top: 8px;
  left: 8px;
  color: var(--brutal-yellow);
  z-index: -1;
  opacity: 0.5;
}

.hero__title-highlight {
  position: absolute;
  top: -4px;
  left: -4px;
  color: transparent;
  -webkit-text-stroke: 1px var(--brutal-red);
  z-index: -2;
  opacity: 0.3;
}

/* Glitch 動畫 */
@keyframes glitch-1 {
  0%, 100% {
    opacity: 0;
    transform: translate(0);
  }
  20% {
    opacity: 0.8;
    transform: translate(-5px, 3px);
  }
  40% {
    opacity: 0;
    transform: translate(5px, -3px);
  }
  60% {
    opacity: 0.8;
    transform: translate(-3px, -2px);
  }
  80% {
    opacity: 0;
    transform: translate(3px, 2px);
  }
}

@keyframes glitch-2 {
  0%, 100% {
    opacity: 0;
    transform: translate(0);
  }
  25% {
    opacity: 0.6;
    transform: translate(4px, -2px);
  }
  50% {
    opacity: 0;
    transform: translate(-4px, 2px);
  }
  75% {
    opacity: 0.6;
    transform: translate(2px, 4px);
  }
}

.hero__title.is-glitching .hero__title-main::before,
.hero__title.is-glitching .hero__title-main::after {
  animation-duration: 0.1s;
}

.hero__subtitle {
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto 3rem;
  font-family: 'Helvetica Neue', sans-serif;
}

.hero__cta {
  display: flex;
  justify-content: center;
}

.hero__cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: var(--brutal-yellow);
  color: var(--brutal-black);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  border: 3px solid var(--brutal-yellow);
  transition: all 0.2s;
}

.hero__cta-btn:hover {
  background: transparent;
  color: var(--brutal-yellow);
}

.hero__cta-arrow {
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.hero__cta-btn:hover .hero__cta-arrow {
  transform: translateX(5px);
}

/* Hero 裝飾元素 */
.hero__decor {
  position: absolute;
  border: 3px solid;
  pointer-events: none;
}

.hero__decor--1 {
  width: 200px;
  height: 200px;
  top: 15%;
  right: 10%;
  border-color: var(--brutal-yellow);
  animation: float-1 8s ease-in-out infinite;
}

.hero__decor--2 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 8%;
  border-color: var(--brutal-red);
  transform: rotate(45deg);
  animation: float-2 6s ease-in-out infinite;
}

.hero__decor--3 {
  width: 60px;
  height: 60px;
  top: 30%;
  left: 15%;
  border-color: var(--brutal-white);
  border-radius: 50%;
  animation: float-3 7s ease-in-out infinite;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, 30px) rotate(10deg); }
}

@keyframes float-2 {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  50% { transform: rotate(45deg) translate(20px, -20px); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, 25px) scale(1.1); }
}

.hero__scroll {
  position: absolute;
  bottom: 3rem;
  right: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
}

.hero__scroll-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--brutal-yellow);
  animation: scroll-line 2s infinite;
}

@keyframes scroll-line {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Section Header */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 4rem;
  padding: 0 4rem;
}

.section-title {
  display: flex;
  flex-direction: column;
  line-height: 0.9;
}

.section-title-main {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.section-title-outline {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 2px var(--brutal-yellow);
}

.section-count {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--brutal-yellow);
}

/* Work Section */
.work {
  padding: 8rem 0;
  background: var(--brutal-black);
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.project {
  position: relative;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.project__index {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 5rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  z-index: 1;
  line-height: 1;
}

.project__image {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
}

.project__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease, filter 0.6s ease;
  filter: grayscale(100%);
}

.project:hover .project__image img {
  transform: scale(1.1);
  filter: grayscale(0%);
}

.project__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
}

.project__info {
  padding: 2rem;
  position: relative;
}

.project__category {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--brutal-yellow);
}

.project__title {
  font-size: 1.75rem;
  font-weight: 900;
  margin: 0.5rem 0;
  letter-spacing: -0.02em;
}

.project__year {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
}

.project__hover-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--brutal-yellow);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
}

.project:hover .project__hover-text {
  opacity: 1;
}

/* About Section */
.about {
  padding: 8rem 4rem;
  background: var(--brutal-yellow);
  color: var(--brutal-black);
}

.about__header {
  margin-bottom: 4rem;
}

.about .section-title-outline {
  -webkit-text-stroke-color: var(--brutal-black);
}

.about__content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
}

.about__photo {
  position: relative;
}

.about__photo img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2);
}

.about__photo-frame {
  position: absolute;
  inset: -15px;
  border: 3px solid var(--brutal-black);
  z-index: -1;
}

.about__name {
  margin-top: 1.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.about__bio p {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.7;
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400;
}

.about__bio--first {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  font-family: 'Arial Black', sans-serif;
}

.about__skills {
  margin-top: 3rem;
}

.skill-block {
  margin-bottom: 2rem;
}

.skill-block__title {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brutal-black);
}

.skill-block__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: var(--brutal-black);
  color: var(--brutal-yellow);
  font-size: 0.875rem;
  font-weight: 700;
}

/* Contact Section */
.contact {
  padding: 8rem 4rem;
  background: var(--brutal-black);
  text-align: center;
}

.contact__title {
  margin-bottom: 2rem;
}

.contact__title-line {
  display: block;
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.contact__title-line--outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--brutal-red);
}

.contact__text {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  margin: 0 auto 4rem;
  font-family: 'Helvetica Neue', sans-serif;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.contact__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.contact__link:hover {
  background: var(--brutal-yellow);
  border-color: var(--brutal-yellow);
  color: var(--brutal-black);
}

.contact__link-label {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  opacity: 0.5;
}

.contact__link-value {
  font-size: 1rem;
  font-weight: 700;
}

.contact__link-arrow {
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.contact__link:hover .contact__link-arrow {
  transform: translateX(5px);
}

/* Footer */
.footer {
  padding: 3rem 4rem;
  background: var(--brutal-black);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.footer__copy {
  color: rgba(255, 255, 255, 0.4);
}

.footer__name {
  color: var(--brutal-white);
}

.footer__tagline {
  color: var(--brutal-yellow);
  letter-spacing: 0.1em;
}

/* Responsive */
@media (max-width: 1024px) {
  .work__grid {
    grid-template-columns: 1fr;
  }

  .about__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about__photo {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 1.5rem 2rem;
  }

  .nav__links {
    gap: 1.5rem;
  }

  .hero {
    padding: 6rem 2rem;
  }

  .hero__decor {
    display: none;
  }

  .hero__scroll {
    right: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0 2rem;
  }

  .work {
    padding: 4rem 0;
  }

  .project__index {
    font-size: 3rem;
    top: 1rem;
    left: 1rem;
  }

  .project__info {
    padding: 1.5rem;
  }

  .project__title {
    font-size: 1.25rem;
  }

  .about,
  .contact {
    padding: 4rem 2rem;
  }

  .footer {
    padding: 2rem;
  }

  .footer__inner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
