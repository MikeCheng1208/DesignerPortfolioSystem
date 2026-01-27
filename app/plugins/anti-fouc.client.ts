export default defineNuxtPlugin(() => {
  // 這個 plugin 只在客戶端執行
  const nuxtApp = useNuxtApp()

  // 在 Nuxt 完全載入後添加 class
  nuxtApp.hook('app:mounted', () => {
    const nuxtEl = document.getElementById('__nuxt')
    if (nuxtEl) {
      requestAnimationFrame(() => {
        nuxtEl.classList.add('nuxt-loaded')
      })
    }
  })
})
