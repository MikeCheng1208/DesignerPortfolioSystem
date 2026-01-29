<script setup lang="ts">
import "./app.css";
import type { SiteSettings } from "~/types/api";

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
  --color-bg: #fafaf9;
  --color-text: #1a1a1a;
  --color-text-muted: #737373;
  --color-accent: #1e40af;
  --color-border: #e5e5e5;

  --font-display: "Instrument Serif", Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

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
