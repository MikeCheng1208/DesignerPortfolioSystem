<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import type {
  Profile,
  ProjectCard,
  SkillCategory,
  ContactInfo,
  SiteSettings,
} from "~/types/api";

const scrolled = ref(false);

// 從 app.vue 注入網站設定
const siteSettings = inject<Ref<SiteSettings | null>>('siteSettings');

// 使用 useFetch 從 API 獲取資料
const { data: profile } = await useFetch<Profile>("/api/profile");
const { data: projects } = await useFetch<ProjectCard[]>("/api/projects");
const { data: skills } = await useFetch<SkillCategory[]>("/api/skills");
const { data: contact } = await useFetch<ContactInfo>("/api/contact");

// 處理標語的換行
const heroTitleLines = computed(() =>
  (profile.value?.heroTitle || "創造有意義的\n數位體驗").split("\n"),
);

const heroSubtitleLines = computed(() =>
  (
    profile.value?.heroSubtitle ||
    "專注於使用者體驗設計與介面創新，\n透過設計解決問題，創造價值"
  ).split("\n"),
);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="portfolio">
    <!-- Navigation -->
    <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
      <div class="nav__container">
        <a href="#" class="nav__logo">{{ profile?.name || "No Name" }}</a>
        <div class="nav__links">
          <a href="#work" class="nav__link">作品</a>
          <a href="#about" class="nav__link">關於</a>
          <a href="#contact" class="nav__link">聯絡</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__container">
        <div class="hero__label">{{ profile?.title || "UI/UX Designer" }}</div>
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
    </section>

    <!-- Featured Work -->
    <section id="work" class="work">
      <div class="work__container">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2 class="section-title">精選作品</h2>
        </div>

        <div class="work__grid">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/work/${project.id}`"
            class="project-card"
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
                <span v-else class="project-card__number">{{
                  String(index + 1).padStart(2, "0")
                }}</span>
              </div>
            </div>
            <div class="project-card__content">
              <div class="project-card__meta">
                <span class="project-card__category">{{
                  project.category
                }}</span>
                <span class="project-card__year">{{ project.year }}</span>
              </div>
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__description">{{ project.description }}</p>
              <div class="project-card__tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{
                  tag
                }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="about__container">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2 class="section-title">關於我</h2>
        </div>

        <!-- Profile Photo -->
        <div class="about__profile">
          <div class="profile-photo">
            <div class="profile-photo__image">
              <img
                v-if="profile?.photo"
                :src="profile.photo"
                :alt="profile?.name || 'Profile Photo'"
                class="profile-photo__img"
              />
              <div v-else class="profile-photo__placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>
            <p class="profile-photo__caption">
              {{ profile?.name || siteSettings?.siteName || "" }}
              {{ profile?.nameEn || "" }}
            </p>
          </div>
        </div>

        <div class="about__content">
          <div class="about__bio">
            <p
              v-for="(paragraph, index) in profile?.bio"
              :key="index"
              class="about__text"
              :class="{ 'about__text--large': index === 0 }"
            >
              {{ paragraph }}
            </p>
          </div>

          <div class="about__skills">
            <div
              v-for="category in skills"
              :key="category.id"
              class="skill-category"
            >
              <h3 class="skill-category__title">{{ category.title }}</h3>
              <ul class="skill-list">
                <li
                  v-for="skill in category.skills"
                  :key="skill"
                  class="skill-item"
                >
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="contact__container">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2 class="section-title">聯絡我</h2>
        </div>

        <div class="contact__content">
          <p class="contact__text">
            {{ contact?.text || "對於合作機會或設計諮詢，歡迎隨時與我聯繫。" }}
          </p>

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
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__container">
        <p class="footer__text">
          © {{ new Date().getFullYear() }} {{ profile?.name || siteSettings?.siteName || "" }}. All rights reserved.
        </p>
        <p class="footer__text">Designed & Built with care</p>
      </div>
    </footer>
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
  transition: all 0.4s var(--ease-out-expo);
}

.nav--scrolled {
  padding: 1rem 0;
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

.nav__logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav__links {
  display: flex;
  gap: 3rem;
}

.nav__link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav__link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width 0.3s var(--ease-out-expo);
}

.nav__link:hover {
  color: var(--color-text);
}

.nav__link:hover::after {
  width: 100%;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8rem 0 4rem;
}

.hero__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  text-align: center;
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
  font-size: clamp(3rem, 8vw, 6.5rem);
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
  margin: 0 auto 3rem;
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
  border-radius: 100px;
  transition: all 0.3s var(--ease-out-expo);
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.9s forwards;
}

.hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);
}

.hero__cta svg {
  transition: transform 0.3s var(--ease-out-expo);
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

/* Work Section */
.work {
  padding: 8rem 0;
  background: white;
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
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 4rem 3rem;
}

.project-card {
  display: block;
  text-decoration: none;
  color: inherit;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
  transition: transform 0.3s var(--ease-out-expo);
}

.project-card:hover {
  transform: translateY(-8px);
}

.project-card__image {
  aspect-ratio: 16 / 10;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
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
  border-radius: 100px;
  color: var(--color-text-muted);
}

/* About Section */
.about {
  padding: 8rem 0;
  background: var(--color-bg);
}

.about__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.about__profile {
  display: flex;
  justify-content: center;
  margin: 4rem 0 5rem;
  opacity: 0;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.3s forwards;
}

.profile-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.profile-photo__image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.4s var(--ease-out-expo);
}

.profile-photo__image:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.profile-photo__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c0c0;
}

.profile-photo__placeholder svg {
  opacity: 0.5;
}

/* 如果有真實照片,可以這樣使用 */
.profile-photo__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo__caption {
  font-family: var(--font-display);
  font-size: 1.125rem;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.about__content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 6rem;
}

.about__bio {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about__text {
  color: var(--color-text-muted);
  line-height: 1.8;
  font-size: 1.0625rem;
}

.about__text--large {
  font-size: 1.5rem;
  color: var(--color-text);
  line-height: 1.6;
  font-weight: 300;
}

.about__skills {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.skill-category__title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.skill-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  color: var(--color-text-muted);
  padding-left: 1.5rem;
  position: relative;
}

.skill-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: 50%;
}

/* Contact Section */
.contact {
  padding: 8rem 0;
  background: white;
}

.contact__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.contact__content {
  max-width: 800px;
}

.contact__text {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 3rem;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact__link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
  transition: all 0.3s var(--ease-out-expo);
}

.contact__link:hover {
  padding-left: 1rem;
  border-color: var(--color-accent);
}

.contact__link-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.contact__link-value {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-text);
}

/* Footer */
.footer {
  padding: 3rem 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.footer__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
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

/* Responsive Design */

/* 平板橫向 (1024px - 1200px) */
@media (max-width: 1200px) {
  .work__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

/* 平板 (768px - 1024px) */
@media (max-width: 1024px) {
  /* 全域容器 */
  .nav__container,
  .hero__container,
  .work__container,
  .about__container,
  .contact__container,
  .footer__container {
    padding: 0 2rem;
  }

  /* Hero 區段 */
  .hero {
    min-height: 80vh;
    padding: 6rem 0 3rem;
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

  /* 作品區段 */
  .work {
    padding: 6rem 0;
  }

  .work__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  /* 關於區段 */
  .about {
    padding: 6rem 0;
  }

  .about__profile {
    margin: 3rem 0 4rem;
  }

  .about__content {
    grid-template-columns: 1fr;
    gap: 4rem;
  }

  .about__skills {
    gap: 2.5rem;
  }

  /* 聯絡區段 */
  .contact {
    padding: 6rem 0;
  }
}

/* 手機橫向 / 小平板 (640px - 768px) */
@media (max-width: 768px) {
  /* 導航 */
  .nav {
    padding: 1.5rem 0;
  }

  .nav__container {
    padding: 0 1.5rem;
  }

  .nav__logo {
    font-size: 1.25rem;
  }

  .nav__links {
    gap: 1.5rem;
  }

  .nav__link {
    font-size: 0.875rem;
  }

  /* Hero 區段 */
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

  /* 區段標題 */
  .section-header {
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .section-number {
    font-size: 0.875rem;
  }

  /* 作品區段 */
  .work {
    padding: 5rem 0;
  }

  .work__container,
  .about__container,
  .contact__container,
  .footer__container {
    padding: 0 1.5rem;
  }

  .work__grid {
    gap: 2.5rem;
  }

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

  /* 關於區段 */
  .about {
    padding: 5rem 0;
  }

  .about__profile {
    margin: 2.5rem 0 3.5rem;
  }

  .profile-photo__image {
    width: 160px;
    height: 160px;
  }

  .profile-photo__caption {
    font-size: 1rem;
  }

  .about__content {
    gap: 3rem;
  }

  .about__text {
    font-size: 1rem;
  }

  .about__text--large {
    font-size: 1.25rem;
  }

  .about__skills {
    gap: 2rem;
  }

  /* 聯絡區段 */
  .contact {
    padding: 5rem 0;
  }

  .contact__text {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
  }

  .contact__link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1.25rem 0;
  }

  .contact__link:hover {
    padding-left: 0;
  }

  .contact__link-value {
    font-size: 1.125rem;
  }

  /* 頁尾 */
  .footer {
    padding: 2.5rem 0;
  }

  .footer__container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer__text {
    font-size: 0.8125rem;
  }
}

/* 手機直向 (< 640px) */
@media (max-width: 640px) {
  /* 導航 */
  .nav__container {
    padding: 0 1.25rem;
  }

  .nav__links {
    gap: 1.25rem;
  }

  .nav__link {
    font-size: 0.8125rem;
  }

  /* Hero 區段 */
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

  /* 所有容器 */
  .work__container,
  .about__container,
  .contact__container,
  .footer__container {
    padding: 0 1.25rem;
  }

  /* 區段間距 */
  .work,
  .about,
  .contact {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }

  /* 作品卡片 */
  .work__grid {
    gap: 2rem;
  }

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

  /* 關於區段 */
  .about__profile {
    margin: 2rem 0 3rem;
  }

  .profile-photo__image {
    width: 140px;
    height: 140px;
    border-width: 2px;
  }

  .profile-photo__placeholder svg {
    width: 60px;
    height: 60px;
  }

  .profile-photo__caption {
    font-size: 0.9375rem;
  }

  .about__content {
    gap: 2.5rem;
  }

  .about__text--large {
    font-size: 1.125rem;
  }

  .skill-category__title {
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
  }

  .skill-item {
    font-size: 0.9375rem;
  }

  /* 聯絡區段 */
  .contact__text {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .contact__links {
    gap: 1.5rem;
  }

  .contact__link {
    padding: 1rem 0;
  }

  .contact__link-label {
    font-size: 0.8125rem;
  }

  .contact__link-value {
    font-size: 1rem;
    word-break: break-all;
  }
}

/* 小手機 (< 480px) */
@media (max-width: 480px) {
  /* 導航 */
  .nav {
    padding: 1.25rem 0;
  }

  .nav__container {
    padding: 0 1rem;
  }

  .nav__logo {
    font-size: 1.125rem;
  }

  .nav__links {
    gap: 1rem;
  }

  .nav__link {
    font-size: 0.75rem;
  }

  /* Hero 區段 */
  .hero__container {
    padding: 0 1rem;
  }

  /* 所有容器 */
  .work__container,
  .about__container,
  .contact__container,
  .footer__container {
    padding: 0 1rem;
  }

  /* 區段 */
  .work,
  .about,
  .contact {
    padding: 3rem 0;
  }

  /* 作品卡片 */
  .project-card__number {
    font-size: 4rem;
  }

  /* 關於區段 */
  .profile-photo__image {
    width: 120px;
    height: 120px;
  }

  .profile-photo__placeholder svg {
    width: 50px;
    height: 50px;
  }
}
</style>
