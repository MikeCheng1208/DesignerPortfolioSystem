<script setup lang="ts">
import { ref, watch, computed } from "vue";
import AdminSidebar from "./AdminSidebar.vue";
import AdminHeader from "./AdminHeader.vue";

interface Props {
  pageTitle?: string;
  pageDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: "儀表板",
  pageDescription: "",
});

// 設定瀏覽器標題
const browserTitle = computed(() => `後台 - ${props.pageTitle}`);

useHead({
  title: browserTitle.value,
});

// 監聽標題變化
watch(
  () => props.pageTitle,
  () => {
    useHead({
      title: `後台 - ${props.pageTitle}`,
    });
  },
);

// 行動版側邊欄狀態
const showMobileSidebar = ref(false);

// 監聽路由變化，關閉行動版側邊欄
const route = useRoute();
watch(
  () => route.path,
  () => {
    showMobileSidebar.value = false;
  },
);
</script>

<template>
  <div class="admin-layout">
    <!-- Desktop Sidebar - 永遠渲染，用 CSS 控制顯示 -->
    <AdminSidebar class="sidebar desktop-sidebar" />

    <!-- Mobile Sidebar -->
    <ClientOnly>
      <template #default>
        <transition name="slide">
          <AdminSidebar
            v-if="showMobileSidebar"
            class="sidebar mobile-sidebar"
          />
        </transition>

        <!-- Overlay -->
        <transition name="fade">
          <div
            v-if="showMobileSidebar"
            class="sidebar-overlay"
            @click="showMobileSidebar = false"
          />
        </transition>

        <!-- Mobile Menu Button -->
        <button
          @click="showMobileSidebar = !showMobileSidebar"
          class="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <UIcon name="i-heroicons-bars-3" class="menu-icon" />
        </button>
      </template>
      <template #fallback>
        <span></span>
      </template>
    </ClientOnly>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <AdminHeader
        :page-title="pageTitle"
        :page-description="pageDescription"
      />

      <!-- Page Content -->
      <main class="page-content">
        <slot />
      </main>
    </div>

  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

/* Sidebar Base */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
}

/* Desktop Sidebar */
.desktop-sidebar {
  z-index: 40;
  display: block;
}

@media (max-width: 1023px) {
  .desktop-sidebar {
    display: none;
  }
}

/* Mobile Sidebar */
.mobile-sidebar {
  z-index: 50;
  display: block;
}

@media (min-width: 1024px) {
  .mobile-sidebar {
    display: none;
  }
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 45;
  backdrop-filter: blur(2px);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 280px;
  }
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  z-index: 40;
  transition: all 0.3s;
}

.mobile-menu-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px -4px rgba(59, 130, 246, 0.5);
}

.mobile-menu-btn:active {
  transform: scale(0.95);
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

.menu-icon {
  width: 24px;
  height: 24px;
  color: white;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
