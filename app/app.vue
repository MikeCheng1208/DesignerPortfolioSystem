<script setup lang="ts">
import "./app.css";
import { watch } from "vue";
import type { SiteSettings } from "~/types/api";
import { useTheme } from "~/composables/useTheme";

const { generateInlineStyles, applyTheme, getDefaultTheme } = useTheme();

// 載入網站設定
const { data: siteSettings } =
  await useFetch<SiteSettings>("/api/site-settings");

// 提供給子元件使用
provide("siteSettings", siteSettings);

// 設定全域 SEO
useSeoMeta({
  title: () => siteSettings.value?.siteTitle || "個人作品集",
  description: () => siteSettings.value?.siteDescription || "",
  author: () => siteSettings.value?.siteAuthor || "",
  ogTitle: () =>
    siteSettings.value?.ogTitle ||
    siteSettings.value?.siteTitle ||
    "個人作品集",
  ogDescription: () =>
    siteSettings.value?.ogDescription ||
    siteSettings.value?.siteDescription ||
    "",
  ogImage: () => siteSettings.value?.ogImage || undefined,
});

// 取得當前主題
const currentTheme = computed(() => siteSettings.value?.theme || getDefaultTheme());

// SSR: 使用 useHead 注入主題樣式，避免 FOUC
useHead({
  style: [
    {
      key: 'theme-variables',
      innerHTML: () => generateInlineStyles(currentTheme.value)
    }
  ]
});

// 客戶端: 監聽主題變化並動態套用
watch(
  currentTheme,
  (theme) => {
    if (import.meta.client) {
      applyTheme(theme);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div id="app">
    <NuxtPage />

    <!-- 全域 Toast 通知 -->
    <AppToaster />
  </div>
</template>

<style>
:root {
  /* 顏色變數 - 由主題系統動態設定 */
  --color-bg: #fafaf9;
  --color-bg-secondary: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #737373;
  --color-accent: #1e40af;
  --color-accent-hover: #1e3a8a;
  --color-border: #e5e5e5;

  /* 字體變數 - 由主題系統動態設定 */
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* 效果變數 - 由主題系統動態設定 */
  --border-radius-button: 100px;
  --border-radius-card: 12px;
  --shadow-card: 0 20px 40px rgba(0, 0, 0, 0.1);
  --nav-blur: blur(20px);
  --nav-bg-opacity: 0.8;

  /* 排版變數 - 由主題系統動態設定 */
  --hero-style: centered;
  --hero-title-size: clamp(3rem, 8vw, 5rem);
  --projects-layout: grid;
  --projects-columns: 2;
  --card-style: elevated;
  --nav-style: top-blur;
  --section-spacing: 8rem;

  /* 動畫變數 - 由主題系統動態設定 */
  --animation-duration: 0.3s;
  --card-hover-transform: translateY(-8px);
  --card-hover-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  /* 動畫緩動函數 - 固定值 */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

::selection {
  background: var(--color-accent);
  color: white;
}

/* 全域響應式設定 */
@media (max-width: 768px) {
  html {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
}

/* 防止小螢幕上文字過小 */
@media (max-width: 360px) {
  html {
    font-size: 13px;
  }
}
</style>
