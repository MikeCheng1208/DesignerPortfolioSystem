# 響應式設計指南

本文檔說明 Admin 後台系統的響應式設計規範和實作細節。

## 斷點定義

系統使用 Tailwind CSS 的預設斷點:

```css
sm:  640px   /* 小型平板和大型手機 */
md:  768px   /* 平板 */
lg:  1024px  /* 桌面 */
xl:  1280px  /* 大型桌面 */
2xl: 1536px  /* 超大型桌面 */
```

## 響應式策略

### 1. 行動優先 (Mobile First)

所有樣式預設針對行動裝置,然後向上擴展至更大螢幕:

```vue
<!-- ✅ 正確:行動優先 -->
<div class="px-4 sm:px-6 lg:px-8">

<!-- ❌ 錯誤:桌面優先 -->
<div class="px-8 md:px-6 sm:px-4">
```

### 2. 主要佈局斷點

- **< 1024px (lg)**: 行動版/平板,側邊欄隱藏為抽屜式
- **>= 1024px**: 桌面版,固定側邊欄

## 元件響應式設計

### AdminLayout

```vue
<!-- 側邊欄行為 -->
- 桌面 (>= 1024px): 固定在左側,寬度 240px
- 行動 (< 1024px): 隱藏,點擊按鈕顯示為浮動抽屜
```

**關鍵實作:**
- 使用 `window.innerWidth < 1024` 檢測行動裝置
- 路由變化時自動關閉行動版側邊欄
- 浮動選單按鈕固定在右下角 (`fixed bottom-4 right-4`)

### AdminHeader

**響應式調整:**
```vue
<!-- 頁面標題 -->
- 行動: text-lg, 單行截斷
- 桌面: text-xl, 顯示描述文字

<!-- 使用者選單 -->
- 行動: 僅顯示頭像
- 桌面: 顯示頭像 + 名稱

<!-- 快速連結 -->
- 行動: 僅圖標
- 平板: 隱藏
- 桌面: 圖標 + 文字
```

**關鍵程式碼:**
```vue
<template>
  <header class="h-16 px-4 sm:px-6">
    <div class="flex-1 min-w-0 mr-4">
      <h2 class="text-lg sm:text-xl truncate">{{ pageTitle }}</h2>
      <p class="text-xs sm:text-sm truncate hidden sm:block">
        {{ pageDescription }}
      </p>
    </div>

    <!-- 桌面按鈕 -->
    <UButton class="hidden md:inline-flex">
      <span class="hidden lg:inline">前往網站</span>
    </UButton>

    <!-- 行動按鈕 -->
    <UButton class="md:hidden" size="sm" />
  </header>
</template>
```

### 表格元件 (UTable)

**策略: 桌面表格 + 行動卡片**

```vue
<!-- 桌面版: 顯示表格 -->
<UTable class="hidden md:table" />

<!-- 行動版: 卡片佈局 -->
<div class="md:hidden space-y-3">
  <UCard v-for="row in data">
    <!-- 卡片內容 -->
  </UCard>
</div>
```

**行動版卡片設計:**
- 使用 `flex` 佈局展示資訊
- 關鍵資訊放在上方
- 操作按鈕放在右上角
- 使用 `truncate` 防止文字溢出

**範例: Users 列表**
```vue
<UCard class="p-4">
  <!-- Header: 頭像 + 名稱 + 操作按鈕 -->
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <UAvatar />
      <div class="flex-1 min-w-0">
        <p class="truncate">{{ name }}</p>
        <p class="truncate text-sm">@{{ username }}</p>
      </div>
    </div>
    <div class="flex gap-1 flex-shrink-0">
      <!-- 操作按鈕 -->
    </div>
  </div>

  <!-- Details: 詳細資訊 -->
  <div class="space-y-2 text-sm">
    <div class="flex items-center justify-between">
      <span>Email:</span>
      <span class="truncate ml-2">{{ email }}</span>
    </div>
  </div>
</UCard>
```

### 表單元件

**網格系統:**
```vue
<!-- 2 欄位佈局 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <UFormGroup label="欄位1" />
  <UFormGroup label="欄位2" />
</div>

<!-- 3 欄位佈局 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- ... -->
</div>
```

**按鈕組:**
```vue
<!-- 響應式按鈕組 -->
<div class="flex flex-col sm:flex-row gap-2">
  <UButton block class="sm:w-auto">取消</UButton>
  <UButton block class="sm:w-auto">確認</UButton>
</div>
```

**完整表單底部範例:**
```vue
<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
  <!-- 刪除按鈕 -->
  <UButton color="red" class="sm:w-auto">
    刪除
  </UButton>

  <!-- 主要操作 -->
  <div class="flex flex-col sm:flex-row gap-2">
    <UButton block class="sm:w-auto">取消</UButton>
    <UButton block class="sm:w-auto">儲存</UButton>
  </div>
</div>
```

### Dashboard 統計卡片

```vue
<!-- 統計卡片網格 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  <UCard>
    <!-- 統計內容 -->
  </UCard>
</div>

<!-- 最近活動 (2 欄) -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
  <UCard><!-- 最近作品 --></UCard>
  <UCard><!-- 最近使用者 --></UCard>
</div>
```

## 間距系統

### Padding 規範

```vue
<!-- Container Padding -->
px-4 sm:px-6 lg:px-8

<!-- Section Spacing -->
space-y-4 sm:space-y-6

<!-- Grid Gap -->
gap-3 sm:gap-4    /* 小型網格 */
gap-4 sm:gap-6    /* 大型網格 */
```

### 文字大小

```vue
<!-- 主標題 -->
text-lg sm:text-xl

<!-- 次標題 -->
text-base sm:text-lg

<!-- 正文 -->
text-sm sm:text-base

<!-- 小字 -->
text-xs sm:text-sm
```

## 常見模式

### 1. 彈性容器 + 截斷

```vue
<div class="flex items-center gap-3 flex-1 min-w-0">
  <UAvatar />
  <div class="flex-1 min-w-0">
    <p class="truncate">{{ longText }}</p>
  </div>
</div>
```

**關鍵點:**
- 父容器: `flex-1 min-w-0`
- 子元素: `truncate` (overflow-hidden + text-ellipsis)

### 2. 條件顯示/隱藏

```vue
<!-- 桌面顯示 -->
<div class="hidden md:block">Desktop Only</div>

<!-- 行動顯示 -->
<div class="md:hidden">Mobile Only</div>

<!-- 平板以上顯示 -->
<div class="hidden sm:block">Tablet & Desktop</div>
```

### 3. 響應式網格

```vue
<!-- 1->2->3 欄 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- 1->2 欄 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

<!-- 自動填充 (最小 200px) -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
```

### 4. 堆疊到水平

```vue
<!-- 行動堆疊,桌面水平 -->
<div class="flex flex-col sm:flex-row gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## 測試檢查清單

### 視覺測試

- [ ] **320px** - 小型手機 (iPhone SE)
- [ ] **375px** - 中型手機 (iPhone 12/13)
- [ ] **768px** - 平板直向 (iPad Mini)
- [ ] **1024px** - 平板橫向 / 小型筆電
- [ ] **1280px** - 標準筆電
- [ ] **1920px** - 桌面顯示器

### 功能測試

- [ ] 側邊欄在行動版正確切換
- [ ] 表格在行動版顯示為卡片
- [ ] 表單在小螢幕可正常使用
- [ ] 按鈕不會溢出螢幕
- [ ] 長文字正確截斷
- [ ] 圖片正確縮放
- [ ] Modal 在小螢幕可正常顯示
- [ ] Dropdown 在小螢幕位置正確

### 瀏覽器測試

- [ ] Chrome (最新版)
- [ ] Safari (最新版)
- [ ] Firefox (最新版)
- [ ] iOS Safari (實機測試)
- [ ] Android Chrome (實機測試)

## 效能最佳化

### 1. 圖片響應式

```vue
<!-- 使用 srcset -->
<img
  src="image.jpg"
  srcset="image-small.jpg 640w, image-medium.jpg 1024w, image-large.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
/>

<!-- 使用 Nuxt Image -->
<NuxtImg
  src="/images/photo.jpg"
  sizes="sm:100vw md:50vw lg:400px"
  densities="x1 x2"
/>
```

### 2. 條件載入

```vue
<script setup>
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  // 只在行動版載入特定元件
  if (isMobile.value) {
    // 動態 import
  }
})
</script>
```

## 無障礙設計

### Touch Target 大小

```vue
<!-- 最小觸控目標: 44x44px -->
<UButton size="sm" class="min-h-[44px] min-w-[44px]" />
```

### 鍵盤導航

- 確保所有互動元素可使用 Tab 鍵存取
- Modal 開啟時鎖定焦點
- 使用語意化 HTML 標籤

### 螢幕閱讀器

```vue
<!-- 使用 aria-label -->
<UButton icon="i-heroicons-trash" aria-label="刪除使用者" />

<!-- 隱藏裝飾性元素 -->
<div aria-hidden="true">...</div>
```

## 常見問題

### Q: 為什麼使用 `hidden md:block` 而不是 `v-if`?

A: CSS 顯示/隱藏比 `v-if` 更高效,因為不需要重新渲染 DOM。但如果元件很複雜,可以使用 `v-if` 來避免載入不必要的程式碼。

### Q: 如何處理固定高度的元素?

A: 避免使用固定高度,改用 `min-h-*` 或 `max-h-*`:

```vue
<!-- ❌ 避免 -->
<div class="h-64">

<!-- ✅ 推薦 -->
<div class="min-h-[200px] h-auto">
```

### Q: 如何測試不同螢幕尺寸?

A:
1. Chrome DevTools: F12 -> Toggle Device Toolbar (Ctrl+Shift+M)
2. Firefox Responsive Design Mode: F12 -> Responsive Design Mode
3. 實機測試: 使用 ngrok 或 localtunnel 暴露本地開發伺服器

## 最佳實踐總結

1. **行動優先** - 預設樣式針對小螢幕,再向上擴展
2. **使用 Tailwind 斷點** - 保持一致性
3. **測試多種裝置** - 確保在各種螢幕尺寸都能正常使用
4. **注意效能** - 避免不必要的重新渲染
5. **保持無障礙** - 確保所有使用者都能使用
6. **文字截斷** - 使用 `truncate` 防止溢出
7. **彈性佈局** - 使用 `flex` 和 `grid` 而非固定尺寸
8. **觸控友善** - 確保按鈕大小足夠

## 未來改進

1. **深色模式支援** - 為所有元件添加深色模式
2. **更多斷點** - 針對超大螢幕優化
3. **手勢支援** - 添加滑動手勢導航
4. **PWA 支援** - 支援離線使用
5. **動畫優化** - 針對效能較差的裝置減少動畫
