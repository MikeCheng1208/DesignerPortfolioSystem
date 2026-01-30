<script setup lang="ts">
/**
 * 科技未來主題
 * 特色：粒子背景、打字機效果、Glitch、掃描線、霓虹發光、網格背景
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// 打字機效果
const typedText = ref('')
const showCursor = ref(true)
const fullText = computed(() => props.heroTitle.replace(/\n/g, ' '))

// 滑鼠軌跡
const trails = ref<{ x: number; y: number; id: number }[]>([])
let trailId = 0

const addTrail = (e: MouseEvent) => {
  trails.value.push({ x: e.clientX, y: e.clientY, id: trailId++ })
  if (trails.value.length > 20) {
    trails.value.shift()
  }
}

// Glitch 效果
const glitchActive = ref(false)
const triggerGlitch = () => {
  glitchActive.value = true
  setTimeout(() => glitchActive.value = false, 200)
}

onMounted(() => {
  // 打字機效果
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < fullText.value.length) {
      typedText.value += fullText.value[i]
      i++
    } else {
      clearInterval(typeInterval)
    }
  }, 80)

  // 游標閃爍
  const cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)

  // 滑鼠軌跡
  window.addEventListener('mousemove', addTrail)

  // 隨機 Glitch
  const glitchInterval = setInterval(triggerGlitch, 5000)

  onUnmounted(() => {
    clearInterval(typeInterval)
    clearInterval(cursorInterval)
    clearInterval(glitchInterval)
    window.removeEventListener('mousemove', addTrail)
  })
})
</script>

<template>
  <div class="tech-theme" :class="{ 'tech-theme--glitch': glitchActive }">
    <!-- 背景效果 -->
    <div class="bg-effects">
      <!-- 網格 -->
      <div class="grid-bg"></div>
      <!-- 掃描線 -->
      <div class="scanline"></div>
      <!-- 粒子 -->
      <div class="particles">
        <div v-for="i in 50" :key="i" class="particle" :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: 3 + Math.random() * 4 + 's'
        }"></div>
      </div>
    </div>

    <!-- 滑鼠軌跡 -->
    <div class="mouse-trails">
      <div
        v-for="(trail, index) in trails"
        :key="trail.id"
        class="trail"
        :style="{
          left: trail.x + 'px',
          top: trail.y + 'px',
          opacity: (index + 1) / trails.length * 0.5
        }"
      ></div>
    </div>

    <!-- 側邊導航 -->
    <nav class="side-nav">
      <div class="side-nav__logo">
        <span class="side-nav__logo-bracket">[</span>
        <span>{{ siteName.substring(0, 2).toUpperCase() }}</span>
        <span class="side-nav__logo-bracket">]</span>
      </div>
      <div class="side-nav__links">
        <a href="#work" class="side-nav__link">
          <span class="side-nav__link-line"></span>
          <span class="side-nav__link-text">_WORK</span>
        </a>
        <a href="#about" class="side-nav__link">
          <span class="side-nav__link-line"></span>
          <span class="side-nav__link-text">_ABOUT</span>
        </a>
        <a href="#contact" class="side-nav__link">
          <span class="side-nav__link-line"></span>
          <span class="side-nav__link-text">_CONTACT</span>
        </a>
      </div>
      <div class="side-nav__status">
        <span class="side-nav__status-dot"></span>
        <span>ONLINE</span>
      </div>
    </nav>

    <!-- Main -->
    <main class="main">
      <!-- Hero -->
      <section class="hero">
        <div class="hero__content">
          <div class="hero__label">
            <span class="hero__label-bracket">&lt;</span>
            <span>{{ profile?.title }}</span>
            <span class="hero__label-bracket">/&gt;</span>
          </div>

          <h1 class="hero__title" :class="{ 'glitch': glitchActive }" :data-text="typedText">
            {{ typedText }}<span class="hero__cursor" v-if="showCursor">_</span>
          </h1>

          <p class="hero__subtitle">&gt; {{ heroSubtitle.replace(/\n/g, ' ') }}</p>

          <div class="hero__actions">
            <a href="#work" class="hero__cta">
              <span class="hero__cta-text">EXPLORE_PROJECTS</span>
              <span class="hero__cta-arrow">→</span>
            </a>
            <div class="hero__stats">
              <div class="hero__stat">
                <span class="hero__stat-value">{{ projects?.length || 0 }}</span>
                <span class="hero__stat-label">PROJECTS</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-value">{{ skills?.reduce((acc, s) => acc + s.skills.length, 0) || 0 }}</span>
                <span class="hero__stat-label">SKILLS</span>
              </div>
            </div>
          </div>
        </div>

        <div class="hero__terminal">
          <div class="terminal">
            <div class="terminal__header">
              <span class="terminal__dot terminal__dot--red"></span>
              <span class="terminal__dot terminal__dot--yellow"></span>
              <span class="terminal__dot terminal__dot--green"></span>
              <span class="terminal__title">portfolio.exe</span>
            </div>
            <div class="terminal__body">
              <p><span class="terminal__prompt">$</span> cat profile.json</p>
              <p class="terminal__output">{</p>
              <p class="terminal__output">&nbsp;&nbsp;"name": "{{ profile?.name }}",</p>
              <p class="terminal__output">&nbsp;&nbsp;"title": "{{ profile?.title }}",</p>
              <p class="terminal__output">&nbsp;&nbsp;"status": "<span class="terminal__highlight">available</span>"</p>
              <p class="terminal__output">}</p>
              <p><span class="terminal__prompt">$</span> <span class="terminal__cursor">_</span></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Work -->
      <section id="work" class="work">
        <div class="section-header">
          <h2 class="section-title">&lt;SELECTED_WORK /&gt;</h2>
          <span class="section-count">{{ String(projects?.length || 0).padStart(2, '0') }}_ITEMS</span>
        </div>

        <div class="work__grid">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/work/${project.id}`"
            class="project-card"
          >
            <div class="project-card__index">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="project-card__image" :style="{ background: project.color }">
              <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title" />
              <div class="project-card__scanline"></div>
              <div class="project-card__overlay">
                <span>VIEW_PROJECT →</span>
              </div>
            </div>
            <div class="project-card__info">
              <span class="project-card__category">[{{ project.category }}]</span>
              <h3 class="project-card__title">{{ project.title }}</h3>
              <div class="project-card__tags">
                <span v-for="tag in project.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- About -->
      <section id="about" class="about">
        <div class="section-header">
          <h2 class="section-title">&lt;ABOUT_ME /&gt;</h2>
        </div>

        <div class="about__content">
          <div class="about__main">
            <div class="about__bio">
              <p v-for="(p, i) in profile?.bio" :key="i" :class="{ 'about__bio--first': i === 0 }">
                <span class="about__bio-prefix">&gt;</span> {{ p }}
              </p>
            </div>
          </div>

          <div class="about__sidebar">
            <div class="about__photo" v-if="profile?.photo">
              <img :src="profile.photo" :alt="profile?.name" />
              <div class="about__photo-frame"></div>
            </div>

            <div class="about__skills">
              <h3>// TECH_STACK</h3>
              <div class="skills-grid">
                <div v-for="cat in skills" :key="cat.id" class="skill-group">
                  <h4>{{ cat.title }}</h4>
                  <div class="skill-bars">
                    <div v-for="skill in cat.skills" :key="skill" class="skill-bar">
                      <span class="skill-bar__name">{{ skill }}</span>
                      <span class="skill-bar__line"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" class="contact">
        <div class="section-header">
          <h2 class="section-title">&lt;CONTACT /&gt;</h2>
        </div>

        <div class="contact__content">
          <p class="contact__text">&gt; {{ contact?.text }}</p>

          <div class="contact__links">
            <a
              v-for="link in contact?.links"
              :key="link.id"
              :href="link.url"
              class="contact__link"
              :target="link.id !== 'email' ? '_blank' : undefined"
            >
              <span class="contact__link-icon">[↗]</span>
              <span class="contact__link-label">{{ link.label.toUpperCase() }}</span>
              <span class="contact__link-value">{{ link.value }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer__left">
          <span>© {{ new Date().getFullYear() }} {{ profile?.name }}</span>
        </div>
        <div class="footer__right">
          <span class="footer__status">
            <span class="footer__status-dot"></span>
            SYSTEM_ACTIVE
          </span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.tech-theme {
  --neon: #00ff88;
  --neon-dim: #00cc6a;
  --dark: #0a0a0a;
  --dark-secondary: #141414;
  background: var(--dark);
  color: #fafafa;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  min-height: 100vh;
}

/* Background Effects */
.bg-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  animation: scanline 10s linear infinite;
}

@keyframes scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--neon);
  border-radius: 50%;
  animation: float-particle linear infinite;
  opacity: 0.5;
}

@keyframes float-particle {
  0% { transform: translateY(100vh); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { transform: translateY(-100vh); opacity: 0; }
}

/* Mouse Trails */
.mouse-trails {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.trail {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--neon);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px var(--neon);
  transition: opacity 0.5s;
}

/* Glitch Effect */
.tech-theme--glitch {
  animation: glitch-screen 0.2s;
}

@keyframes glitch-screen {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #ff0000;
  animation: glitch-1 0.2s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch::after {
  color: #00ffff;
  animation: glitch-2 0.2s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0); }
}

@keyframes glitch-2 {
  0% { transform: translate(0); }
  20% { transform: translate(3px, -3px); }
  40% { transform: translate(3px, 3px); }
  60% { transform: translate(-3px, -3px); }
  80% { transform: translate(-3px, 3px); }
  100% { transform: translate(0); }
}

/* Side Navigation */
.side-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: var(--dark-secondary);
  border-right: 1px solid rgba(0, 255, 136, 0.2);
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  z-index: 100;
}

.side-nav__logo {
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: var(--neon);
  margin-bottom: 3rem;
}

.side-nav__logo-bracket {
  opacity: 0.5;
}

.side-nav__links {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.side-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #a3a3a3;
  padding: 1rem 0;
  transition: all 0.3s;
}

.side-nav__link-line {
  width: 20px;
  height: 1px;
  background: currentColor;
  transition: all 0.3s;
}

.side-nav__link:hover {
  color: var(--neon);
}

.side-nav__link:hover .side-nav__link-line {
  width: 40px;
  box-shadow: 0 0 10px var(--neon);
}

.side-nav__link-text {
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.side-nav__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.5rem;
  color: var(--neon);
  letter-spacing: 0.1em;
}

.side-nav__status-dot {
  width: 6px;
  height: 6px;
  background: var(--neon);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--neon); }
  50% { opacity: 0.5; box-shadow: 0 0 10px 5px transparent; }
}

/* Main */
.main {
  margin-left: 80px;
  position: relative;
  z-index: 2;
}

/* Hero */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  padding: 4rem;
  align-items: center;
}

.hero__label {
  font-size: 0.875rem;
  color: var(--neon);
  margin-bottom: 1rem;
}

.hero__label-bracket {
  opacity: 0.5;
}

.hero__title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero__cursor {
  color: var(--neon);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero__subtitle {
  font-size: 1rem;
  color: #a3a3a3;
  margin-bottom: 3rem;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.hero__cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--neon);
  color: var(--neon);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.hero__cta:hover {
  background: var(--neon);
  color: var(--dark);
  box-shadow: 0 0 30px var(--neon);
}

.hero__cta-arrow {
  transition: transform 0.3s;
}

.hero__cta:hover .hero__cta-arrow {
  transform: translateX(5px);
}

.hero__stats {
  display: flex;
  gap: 2rem;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero__stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neon);
}

.hero__stat-label {
  font-size: 0.625rem;
  color: #a3a3a3;
  letter-spacing: 0.1em;
}

/* Terminal */
.terminal {
  background: var(--dark-secondary);
  border: 1px solid rgba(0, 255, 136, 0.2);
  font-size: 0.75rem;
}

.terminal__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
}

.terminal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal__dot--red { background: #ff5f56; }
.terminal__dot--yellow { background: #ffbd2e; }
.terminal__dot--green { background: #27ca40; }

.terminal__title {
  margin-left: auto;
  color: #a3a3a3;
}

.terminal__body {
  padding: 1rem;
  line-height: 1.8;
}

.terminal__prompt {
  color: var(--neon);
}

.terminal__output {
  color: #a3a3a3;
}

.terminal__highlight {
  color: var(--neon);
}

.terminal__cursor {
  animation: blink 1s infinite;
  color: var(--neon);
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--neon);
}

.section-count {
  font-size: 0.75rem;
  color: #a3a3a3;
}

/* Work */
.work {
  padding: 4rem;
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.project-card {
  text-decoration: none;
  color: inherit;
  position: relative;
}

.project-card__index {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 0.75rem;
  color: var(--neon);
  z-index: 1;
}

.project-card__image {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
  filter: grayscale(50%);
}

.project-card:hover .project-card__image img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.project-card__scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 255, 136, 0.05) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
}

.project-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: var(--neon);
  font-size: 0.875rem;
}

.project-card:hover .project-card__overlay {
  opacity: 1;
}

.project-card__info {
  padding: 1.5rem 0;
}

.project-card__category {
  font-size: 0.625rem;
  color: var(--neon);
  letter-spacing: 0.1em;
}

.project-card__title {
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0.5rem 0;
}

.project-card__tags {
  display: flex;
  gap: 0.5rem;
}

.project-card__tags span {
  font-size: 0.625rem;
  padding: 0.25rem 0.5rem;
  background: var(--dark-secondary);
  border: 1px solid rgba(0, 255, 136, 0.2);
  color: #a3a3a3;
}

/* About */
.about {
  padding: 4rem;
  background: var(--dark-secondary);
}

.about__content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
}

.about__bio p {
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 1.5rem;
  color: #a3a3a3;
}

.about__bio--first {
  font-size: 1.25rem;
  color: #fafafa;
}

.about__bio-prefix {
  color: var(--neon);
}

.about__photo {
  position: relative;
  margin-bottom: 2rem;
}

.about__photo img {
  width: 100%;
  filter: grayscale(100%);
  mix-blend-mode: luminosity;
}

.about__photo-frame {
  position: absolute;
  inset: 10px;
  border: 1px solid var(--neon);
  pointer-events: none;
}

.about__skills h3 {
  font-size: 0.75rem;
  color: var(--neon);
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.skill-group {
  margin-bottom: 2rem;
}

.skill-group h4 {
  font-size: 0.625rem;
  color: #a3a3a3;
  margin-bottom: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.skill-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.skill-bar__name {
  font-size: 0.75rem;
  min-width: 100px;
}

.skill-bar__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--neon), transparent);
}

/* Contact */
.contact {
  padding: 4rem;
}

.contact__text {
  font-size: 1.25rem;
  color: #a3a3a3;
  margin-bottom: 3rem;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
}

.contact__link {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--dark-secondary);
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.contact__link:hover {
  border-color: var(--neon);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
}

.contact__link-icon {
  color: var(--neon);
  font-size: 0.875rem;
}

.contact__link-label {
  font-size: 0.625rem;
  color: #a3a3a3;
  letter-spacing: 0.1em;
  width: 80px;
}

.contact__link-value {
  flex: 1;
}

/* Footer */
.footer {
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 255, 136, 0.2);
  font-size: 0.75rem;
  color: #a3a3a3;
}

.footer__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neon);
}

.footer__status-dot {
  width: 6px;
  height: 6px;
  background: var(--neon);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Responsive */
@media (max-width: 1200px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero__terminal {
    display: none;
  }

  .work__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about__content {
    grid-template-columns: 1fr;
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
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 2rem;
    border-right: none;
    border-top: 1px solid rgba(0, 255, 136, 0.2);
  }

  .side-nav__logo {
    margin: 0;
  }

  .side-nav__links {
    flex-direction: row;
    gap: 1rem;
  }

  .side-nav__link {
    padding: 0.5rem;
  }

  .side-nav__link-line {
    display: none;
  }

  .side-nav__link-text {
    writing-mode: horizontal-tb;
  }

  .side-nav__status {
    flex-direction: row;
  }

  .main {
    margin-left: 0;
    padding-bottom: 60px;
  }

  .hero,
  .work,
  .about,
  .contact,
  .footer {
    padding: 3rem 2rem;
  }

  .work__grid {
    grid-template-columns: 1fr;
  }

  .mouse-trails {
    display: none;
  }
}
</style>
