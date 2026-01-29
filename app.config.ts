export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
    // Nuxt UI v4 Toaster 配置
    toaster: {
      position: 'top-right' as const,
      expand: true,
      duration: 3000
    }
  }
})
