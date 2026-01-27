<script setup lang="ts">

definePageMeta({
  middleware: 'admin-auth'
})

// 自動導向儀表板
navigateTo('/admin/dashboard')
</script>

<template>
  <div></div>
</template>
